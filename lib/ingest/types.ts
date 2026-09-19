// Shared ingest types across all six jobs.
// Match is always by ADDRESS, never name.

export type Job = 'lending' | 'loop' | 'tranche' | 'allocator' | 'curator' | 'exit';

// ---- Tier 1: Lending market (pulled) ----
export interface RawMarket {
  venue: 'morpho' | 'kamino' | 'loopscale' | 'aave-horizon' | 'euler';
  surface: string;
  chain: string;
  collateralAddress: string;
  collateralSymbol: string;
  borrowAddress: string;
  borrowSymbol: string;
  lltv: string | null;
  rateType: 'variable' | 'fixed';
  borrowApy: number | null;
  supplyApy: number | null;
  totalSupplyUsd: number | null;
  totalBorrowUsd: number | null;
  utilization: number | null;
  curator: string | null;
  raw: unknown;
}

// ---- Tier 2: Loop engine (derived from lending, no separate API) ----
export interface RawLoop {
  engine: '3F' | 'Kamino Multiply' | 'Loopscale Loops' | 'Gauntlet Aera' | 'Zharta' | 'Keyring Unwind';
  underlyingVenue: string;      // which lending market it sits on
  chain: string;
  collateralAddress: string;
  collateralSymbol: string;
  fundApy: number | null;       // yield on the collateral token
  borrowApy: number | null;     // cost, from the underlying market
  netApyOnEquity: number | null;// computed: (fundApy - borrowApy) * leverage approx
  maxLeverage: number | null;
  settlement: 'one-click' | 'wait';
  raw: unknown;
}

// ---- Tier 1: Tranche (Pendle + per-protocol) ----
export interface RawTranche {
  venue: 'pendle' | 'strata' | 'exponent' | '3jane' | 'royco';
  chain: string;
  underlyingAddress: string;    // the SY / underlying token
  underlyingSymbol: string;
  ptAddress: string | null;
  ytAddress: string | null;
  impliedApy: number | null;
  ptDiscount: number | null;
  liquidityUsd: number | null;
  maturity: string | null;      // ISO date
  raw: unknown;
}

// ---- Tier 3: Curator (free with lending pull) ----
export interface RawCurator {
  name: string;
  venue: string;
  marketsCurated: number;
  totalDepositsUsd: number | null;
  badDebtUsd: number | null;
  raw: unknown;
}

// ---- Matched wrappers ----
export interface Matched<T> {
  ticker: string;
  postedAsWrapper: boolean;
  data: T;
}
export interface Miss {
  address: string;
  symbol: string;
  venue: string;
  chain: string;
  job: Job;
}
