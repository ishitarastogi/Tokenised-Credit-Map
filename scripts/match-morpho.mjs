// Morpho ingest — Blue + Midnight + Vaults, matched to your tokens.
// node run.mjs      (Node 18+, no deps)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const ENDPOINT = 'https://api.morpho.org/graphql';
// Tickers come straight from lib/data.ts — this project doesn't keep a
// separate tokens.json (that's only in the standalone morpho-kit).
const dataSrc = readFileSync(new URL('../lib/data.ts', import.meta.url), 'utf8');
const TOKENS = [...dataSrc.matchAll(/A\('([^']+)'/g)].map((m) => ({ ticker: m[1] }));
const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const stripWrap = s => (s || '').replace(/^w/i, '').replace(/wrapped/i, '');
const bySym = new Map(TOKENS.map(t => [norm(t.ticker), t.ticker]));
const match = sym => bySym.get(norm(sym)) || bySym.get(norm(stripWrap(sym))) || null;

const CHAIN = { 1:'ethereum', 137:'polygon', 10:'optimism', 8453:'base', 42161:'arbitrum', 130:'unichain' };
const chainName = id => CHAIN[id] ?? String(id ?? '');

async function gql(query, variables) {
  const r = await fetch(ENDPOINT, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) { console.error(JSON.stringify(j.errors, null, 2)); throw new Error('GraphQL error'); }
  return j.data;
}

// ---- introspect the state type once, so we only ask for scalar fields that exist ----
async function stateFields() {
  const d = await gql(`{ __type(name:"MarketState"){ fields{ name } } }`);
  const have = new Set((d.__type?.fields ?? []).map(f => f.name));
  return ['borrowApy','supplyApy','supplyAssetsUsd','borrowAssetsUsd','utilization']
    .filter(n => have.has(n));
}

// ---- Blue + Midnight markets. Morpho returns both through `markets`;
//      Midnight markets carry a maturity/tenor, Blue ones don't. ----
async function marketShape() {
  const d = await gql(`{ __type(name:"Market"){ fields{ name } } }`);
  return new Set((d.__type?.fields ?? []).map(f => f.name));
}

async function fetchMarkets(stateSel, mFields) {
  // Midnight markets carry a maturity/tenor; Blue markets don't. Whatever the
  // field is called in the schema, we detect it and use its presence as the flag.
  const maturityField = ['maturity','endDate','expiry','tenor','fixedTermEndTimestamp']
    .find(f => mFields.has(f));
  const oracleSel = mFields.has('oracle') ? 'oracle { address }' : '';
  const irmSel = mFields.has('irmAddress') ? 'irmAddress' : '';
  const matSel = maturityField ? maturityField : '';
  // Whatever this market's ID field is actually called right now — confirmed
  // once already as 'uniqueKey' and once as absent entirely. Don't hardcode it.
  const idField = ['uniqueKey', 'id', 'marketId'].find(f => mFields.has(f));
  const idSel = idField ? idField : '';
  const q = `query {
    markets(first: 1000) {
      items {
        ${idSel}
        lltv
        chain { id }
        collateralAsset { symbol address }
        loanAsset { symbol address }
        state { ${stateSel.join(' ')} }
        ${matSel}
        ${oracleSel}
        ${irmSel}
      }
    }
  }`;
  const d = await gql(q);
  const items = (d.markets?.items ?? []).filter(m => m.collateralAsset);
  const matched = [], misses = [];
  for (const m of items) {
    const sym = m.collateralAsset.symbol || '';
    const ticker = match(sym);
    const st = m.state ?? {};
    const maturityRaw = maturityField ? m[maturityField] : null;
    const isMidnight = maturityRaw != null && maturityRaw !== 0 && maturityRaw !== '0';
    const row = {
      surface: isMidnight ? 'Midnight' : 'Blue',
      rateType: isMidnight ? 'fixed' : 'variable',
      maturity: isMidnight ? (String(maturityRaw).length >= 12
        ? new Date(Number(maturityRaw) * 1000).toISOString().slice(0,10)
        : String(maturityRaw)) : null,
      ticker, collateralSymbol: sym,
      collateralAddress: m.collateralAsset?.address ?? '',
      borrow: m.loanAsset?.symbol ?? '',
      borrowAddress: m.loanAsset?.address ?? '',
      chain: chainName(m.chain?.id),
      lltv: m.lltv ? +(Number(m.lltv)/1e18).toFixed(4) : null,
      borrowApy: st.borrowApy ?? null,
      supplyApy: st.supplyApy ?? null,
      supplyUsd: st.supplyAssetsUsd ?? null,
      borrowUsd: st.borrowAssetsUsd ?? null,
      utilization: st.utilization ?? null,
      oracle: m.oracle?.address ?? null,
      marketUrl: idField ? `https://app.morpho.org/${chainName(m.chain?.id)}/market/${m[idField]}` : null,
    };
    if (ticker) matched.push(row);
    else if (sym) misses.push({ symbol: sym, chain: row.chain, surface: 'Blue' });
  }
  return { matched, misses };
}

// ---- Vaults: which curated vaults exist, their curator, and what they hold.
//      This is the curator + supply side of the same markets. ----
async function vaultShape() {
  // discover what Vault, VaultState and VaultMetadata actually expose
  const d = await gql(`{
    V: __type(name:"Vault"){ fields{ name } }
    S: __type(name:"VaultState"){ fields{ name } }
    M: __type(name:"VaultMetadata"){ fields{ name type{ name kind ofType{ name } } } }
  }`);
  const set = t => new Set((t?.fields ?? []).map(f => f.name));
  const vFields = set(d.V), sFields = set(d.S), mFields = set(d.M);
  // curator field name varies: curators | curatorsMetadata | curator
  const mCuratorField = (d.M?.fields ?? []).find(f => /curator/i.test(f.name));
  return { vFields, sFields, mFields, mCuratorField: mCuratorField?.name ?? null };
}

async function fetchVaults() {
  const shape = await vaultShape();
  const has = (set, ...n) => n.filter(x => set.has(x));
  const sSel = has(shape.sFields, 'totalAssetsUsd', 'apy', 'netApy', 'totalAssets');
  const stateSel = sSel.length ? `state { ${sSel.join(' ')} }` : '';
  // metadata curator sub-selection — curators is a list of objects with a name
  let metaSel = '';
  if (shape.mCuratorField) metaSel = `metadata { ${shape.mCuratorField} { name } }`;
  const assetSel = shape.vFields.has('asset') ? 'asset { symbol }' : '';
  const nameSel = shape.vFields.has('name') ? 'name' : '';
  const chainSel = shape.vFields.has('chain') ? 'chain { id }' : '';

  const q = `query {
    vaults(first: 1000) {
      items { ${nameSel} ${chainSel} ${assetSel} ${stateSel} ${metaSel} }
    }
  }`;
  let d;
  try { d = await gql(q); }
  catch (e) { console.warn('vault query failed:', e.message); return []; }

  const curField = shape.mCuratorField;
  return (d.vaults?.items ?? []).map(v => {
    const curatorList = curField ? (v.metadata?.[curField] ?? []) : [];
    return {
      name: v.name ?? '',
      chain: chainName(v.chain?.id),
      asset: v.asset?.symbol ?? '',
      tvlUsd: v.state?.totalAssetsUsd ?? null,
      apy: v.state?.apy ?? v.state?.netApy ?? null,
      curators: curatorList.map(c => c.name).filter(Boolean).join(', '),
    };
  });
}

// ---- run ----
console.log('Introspecting…');
const stateSel = await stateFields();
console.log('state fields:', stateSel.join(', '), '\n');

const mFields = await marketShape();
console.log('Market fields available:', [...mFields].join(', '), '\n');
console.log('Fetching Blue + Midnight markets…');
const { matched, misses } = await fetchMarkets(stateSel, mFields);
matched.sort((a,b) => (b.supplyUsd ?? -1) - (a.supplyUsd ?? -1));

console.log('Fetching vaults…');
const vaults = await fetchVaults();
// keep vaults whose asset is a stable your tokens borrow, or that mention a matched curator — keep all, tag relevance
const relevant = vaults.filter(v => v.tvlUsd && v.tvlUsd > 0);

mkdirSync('out', { recursive: true });
writeFileSync('out/markets.json', JSON.stringify(matched, null, 2));
writeFileSync('out/vaults.json', JSON.stringify(relevant, null, 2));
writeFileSync('out/misses.json', JSON.stringify(misses, null, 2));

const fmt = n => n==null ? '—' : n>=1e6 ? '$'+(n/1e6).toFixed(1)+'M' : n>=1e3 ? '$'+(n/1e3).toFixed(0)+'k' : '$'+Math.round(n);
const pct = n => n==null ? '—' : (n*100).toFixed(2)+'%';

console.log(`\n=== Markets matched: ${matched.length} ===`);
console.table(matched.map(m => ({
  ticker: m.ticker, surface: m.surface, rate: m.rateType,
  borrow: m.borrow, chain: m.chain, lltv: m.lltv ?? '—',
  maturity: m.maturity ?? '—', borrowApy: pct(m.borrowApy),
  util: m.utilization!=null ? (m.utilization*100).toFixed(0)+'%' : '—',
  supplied: fmt(m.supplyUsd),
})));
console.log('Tokens live on Morpho:', [...new Set(matched.map(m=>m.ticker))].join(', ') || '(none)');

console.log('\nMarket links:');
matched.forEach(m => console.log(`  ${m.ticker} (${m.borrow}, ${m.chain}) -> ${m.marketUrl}`));

console.log(`\n=== Vaults with TVL: ${relevant.length} ===`);
console.table(relevant.slice(0, 25).map(v => ({
  vault: v.name?.slice(0,28), asset: v.asset, curator: v.curators?.slice(0,24), tvl: fmt(v.tvlUsd),
})));

console.log(`\nMisses (Morpho collateral not in your list): ${misses.length}`);
console.log('Wrote out/markets.json, out/vaults.json, out/misses.json');
