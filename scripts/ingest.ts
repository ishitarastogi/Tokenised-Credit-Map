// Full ingest across the jobs we can pull or derive:
//   lending (pulled), curator (derived), loop (derived), tranche (pulled).
// allocator + exit are structural — handled separately, not here.
//
// Writes data/ingest.json consumed by the dashboard.
// Usage: npx tsx scripts/ingest.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { fetchMorpho } from '@/lib/ingest/morpho';
import { fetchEuler } from '@/lib/ingest/euler';
import { fetchKamino } from '@/lib/ingest/kamino';
import { fetchLoopscale } from '@/lib/ingest/loopscale';
import { fetchAaveHorizon } from '@/lib/ingest/aave-horizon';
import { fetchPendle } from '@/lib/ingest/pendle';
import { deriveLoops } from '@/lib/ingest/loop';
import { deriveCurators } from '@/lib/ingest/curator';
import { resolveTicker, TOKEN_ADDRESSES } from '@/lib/addresses';
import type { Matched, Miss, RawMarket, RawTranche } from '@/lib/ingest/types';

async function safe<T>(label: string, fn: () => Promise<T[]>): Promise<T[]> {
  try { const r = await fn(); console.log(`  ${label}: ${r.length}`); return r; }
  catch (e) { console.warn(`  ${label}: FAILED — ${(e as Error).message}`); return []; }
}

const tickerOf = (chain: string, addr: string) => resolveTicker(chain, addr)?.ticker ?? null;

async function main() {
  console.log('Lending…');
  const solMints = TOKEN_ADDRESSES.filter((t) => t.chain === 'solana' && t.address).map((t) => t.address);
  const markets: RawMarket[] = [
    ...await safe('morpho', fetchMorpho),
    ...await safe('euler', () => fetchEuler(1)),
    ...await safe('kamino', fetchKamino),
    ...await safe('loopscale', () => fetchLoopscale(solMints)),
    ...await safe('aave-horizon', fetchAaveHorizon),
  ];

  const lendMatched: Matched<RawMarket>[] = [];
  const misses: Miss[] = [];
  for (const m of markets) {
    const hit = resolveTicker(m.chain, m.collateralAddress);
    if (!hit) { misses.push({ address: m.collateralAddress, symbol: m.collateralSymbol, venue: m.venue, chain: m.chain, job: 'lending' }); continue; }
    lendMatched.push({ ticker: hit.ticker, postedAsWrapper: hit.wrapper, data: m });
  }

  console.log('Deriving loop + curator…');
  const loops = deriveLoops(markets, tickerOf).map((l) => {
    const hit = resolveTicker(l.chain, l.collateralAddress);
    return { ticker: hit?.ticker ?? '?', postedAsWrapper: hit?.wrapper ?? false, data: l };
  }).filter((l) => l.ticker !== '?');
  const curators = deriveCurators(markets);

  console.log('Tranche (Pendle)…');
  const tranche = await safe<RawTranche>('pendle', fetchPendle);
  const trMatched: Matched<RawTranche>[] = [];
  for (const t of tranche) {
    const hit = resolveTicker(t.chain, t.underlyingAddress);
    if (!hit) { misses.push({ address: t.underlyingAddress, symbol: t.underlyingSymbol, venue: t.venue, chain: t.chain, job: 'tranche' }); continue; }
    trMatched.push({ ticker: hit.ticker, postedAsWrapper: hit.wrapper, data: t });
  }

  const bundle = {
    generatedAt: new Date().toISOString(),
    lending: lendMatched,
    loop: loops,
    curator: curators,
    tranche: trMatched,
    misses,
  };

  mkdirSync('data', { recursive: true });
  writeFileSync('data/ingest.json', JSON.stringify(bundle, null, 2));
  console.log(`\nMatched — lending ${lendMatched.length}, loop ${loops.length}, curator ${curators.length}, tranche ${trMatched.length}`);
  console.log(`Misses ${misses.length}. Wrote data/ingest.json`);
}
main();
