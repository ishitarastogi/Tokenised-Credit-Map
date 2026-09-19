// Curator — comes free with the lending pull. Aggregate markets by curator name.
// Bad-debt history needs market history, left null until wired.
import type { RawCurator, RawMarket } from './types';

export function deriveCurators(markets: RawMarket[]): RawCurator[] {
  const by = new Map<string, RawCurator>();
  for (const m of markets) {
    if (!m.curator) continue;
    const key = `${m.curator}|${m.venue}`;
    const cur = by.get(key) ?? {
      name: m.curator, venue: m.venue, marketsCurated: 0, totalDepositsUsd: 0, badDebtUsd: null, raw: {},
    };
    cur.marketsCurated += 1;
    cur.totalDepositsUsd = (cur.totalDepositsUsd ?? 0) + (m.totalSupplyUsd ?? 0);
    by.set(key, cur);
  }
  return [...by.values()];
}
