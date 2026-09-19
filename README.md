# Onchain Primer

Visual-first public reference for onchain private credit. Next.js 15 + React 19 + TypeScript.

## Structure

- `app/onchain/` — Step 1: how credit becomes a token (platform → token → issuer, curved flow diagram)
- `app/defi/` — Step 2: how to use the token (Collateral/borrow, Loop, Allocator holds it)
- `lib/data.ts` — the 106-token dataset (ticker, name, issuer, kind, platform)
- `lib/defi-data.ts` — **real, verified DeFi data** pulled this session (see below)
- `lib/addresses.ts` — token contract addresses per chain, for matching pulled market data by address
- `lib/ingest/` — venue fetchers (Morpho, Kamino, Euler, Pendle live; Loopscale, Aave Horizon stubbed)
- `scripts/ingest.ts` — runs all fetchers, matches, writes `data/ingest.json`
- `scripts/match-morpho.mjs` — standalone Morpho matcher, no build step, matches by symbol

## What's verified vs placeholder

**`lib/defi-data.ts` is real data**, not scaffolding:
- **Lending** — 14 tokens, 46 market rows, pulled from Morpho's GraphQL API and Kamino's REST API this session. Live vs seeded (dust, <$1k) is tagged per row.
- **Loop** — 17 pairs across 6 tokens, Kamino Multiply, one row per (token, borrow asset) since Max Leverage APY varies enormously by pair (e.g. syrupUSDC/USDS at 23% vs syrupUSDC/USDC at 6%). Max leverage = 1/(1-maxLTV), confirmed against Kamino's own UI.
- **Tranche** — 8 splits, hand-verified from each project's site (Strata, Exponent, 3jane, Royco, Pendle).
- **Allocator** — 7 holders, hand-verified (InfiniFi, Noon, Ethena, Grove, Sky, Resolv, Ember).

**Still open:**
- **Borrowed ($)** column — the field exists in the raw API pull (`totalBorrowUsd`) but isn't wired into the simplified `LendMarket` type yet.
- **Curator** column — not verified per-market. Kamino's Earn page shows curators per *vault* (Steakhouse, Sentora, Gauntlet, Allez, RockawayX), but that's not confirmed to map 1:1 to these specific borrow reserves.
- **Euler, Aave Horizon, Loopscale** — fetchers stubbed in `lib/ingest/`, not yet pulled.
- **Curator, Exit** jobs — not built as page sections yet; need the same verified-project-table treatment as Allocator/Tranche got.

## Data ingest, per venue

| Venue | Status | Source |
|---|---|---|
| Morpho | ✅ Live, verified | `api.morpho.org/graphql`, public, no key. See `lib/ingest/morpho.ts` |
| Kamino | ✅ Live, verified | `api.kamino.finance` REST, public, no key. See `lib/ingest/kamino.ts` |
| Pendle | ✅ Fetcher built | `api-v2.pendle.finance`, public, no key |
| Euler | Stub | `app.euler.finance/api/public/metadata`, needs testing |
| Aave Horizon | Stub | AaveKit (`@aave/react`), not wired |
| Loopscale | Not started | Confirmed endpoints exist (`tars.loopscale.com/v1/markets/quote`, `/markets/loop/info`) but return no symbol — needs the address table in `lib/addresses.ts` filled in first |

To pull fresh Morpho data without the full Next.js build:
```
node scripts/match-morpho.mjs
```

## Numbers are live snapshots

Every APY, TVL, and leverage number in `lib/defi-data.ts` was correct at the time it was pulled this session. Re-run the fetchers for current figures — what's stable is which markets and tokens exist, not the numbers themselves.

## Adding a token

One line in `lib/data.ts`:
```ts
A('TICKER', 'Full name', 'Issuer firm', KIND, 'optional detail label')
```
