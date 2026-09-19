# Market ingest

1. Fill every `address: ''` in `lib/addresses.ts` (one-time, manual).
2. `npx tsx scripts/ingest.ts`
3. Check `data/markets.misses.json` — addresses that didn't match. Either add
   them to `addresses.ts` (token you want) or ignore (not private credit).
4. `data/markets.matched.json` feeds the DeFi page's market rows.

## Naming, per venue
- Morpho, Kamino, Euler, Aave Horizon return symbol/name — no resolution needed.
- Loopscale returns no symbol; matched purely by mint address.

## Notes
- Match is by ADDRESS, never name. wJAAA resolves to base ticker JAAA.
- Morpho Midnight (fixed) needs the REST path added in morpho.ts.
- Aave Horizon fetcher is a stub — wire AaveKit or the Horizon subgraph.
- APYs/TVL/utilization go stale fast; re-run on a schedule.
