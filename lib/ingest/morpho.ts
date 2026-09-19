// Morpho — confirmed working query (matches morpho-kit/run.mjs, which pulled
// real data: 16 markets, 6 tokens live). GraphQL returns loanAsset /
// collateralAsset with { address, symbol, decimals } directly, so no address
// resolution needed on this venue — matching is by symbol.
//
// state fields are introspected at call time rather than hardcoded, because
// Morpho's schema changed mid-session (see morpho-kit/README.md) and a naive
// field list breaks. This mirrors that fix.
import type { RawMarket } from './types';

const ENDPOINT = 'https://api.morpho.org/graphql';
const CHAIN: Record<number, string> = { 1: 'ethereum', 137: 'polygon', 10: 'optimism', 8453: 'base', 42161: 'arbitrum', 130: 'unichain' };

async function gql(query: string): Promise<any> {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

/** Confirmed field names on MarketState as of this session — introspect first. */
async function stateFields(): Promise<string[]> {
  const d = await gql(`{ __type(name:"MarketState"){ fields{ name } } }`);
  const have = new Set<string>((d.__type?.fields ?? []).map((f: any) => f.name));
  return ['borrowApy', 'supplyApy', 'supplyAssetsUsd', 'borrowAssetsUsd', 'utilization'].filter((n) => have.has(n));
}

export async function fetchMorpho(): Promise<RawMarket[]> {
  const stateSel = await stateFields();
  const query = `query {
    markets(first: 1000) {
      items {
        uniqueKey
        lltv
        chain { id }
        collateralAsset { symbol address }
        loanAsset { symbol address }
        badDebt { usd }
        state { ${stateSel.join(' ')} }
      }
    }
  }`;
  const d = await gql(query);
  const items = (d.markets?.items ?? []).filter((m: any) => m.collateralAsset);

  return items.map((m: any): RawMarket => {
    const st = m.state ?? {};
    const chain = CHAIN[m.chain?.id] ?? String(m.chain?.id ?? '');
    return {
      venue: 'morpho',
      surface: 'Blue', // confirmed: no token in this dataset is on Midnight yet (launched Jul 2026, Base only, crypto collateral only)
      chain,
      collateralAddress: m.collateralAsset.address,
      collateralSymbol: m.collateralAsset.symbol,
      borrowAddress: m.loanAsset?.address ?? '',
      borrowSymbol: m.loanAsset?.symbol ?? '',
      lltv: m.lltv ? (Number(m.lltv) / 1e18).toFixed(4) : null,
      rateType: 'variable',
      borrowApy: st.borrowApy ?? null,
      supplyApy: st.supplyApy ?? null,
      totalSupplyUsd: st.supplyAssetsUsd ?? null,
      totalBorrowUsd: st.borrowAssetsUsd ?? null,
      utilization: st.utilization ?? null,
      curator: null, // not verified per-market yet — see lib/ingest/curator.ts, which derives it from vaults, not reserves
      raw: { ...m, marketUrl: `https://app.morpho.org/${chain}/market/${m.uniqueKey}` },
    };
  });
}
