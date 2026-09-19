// lib/defi-data.ts — REAL, verified data pulled this session from Morpho's
// and Kamino's own APIs, plus hand-verified project pages for Tranche and
// Allocator. Nothing here is a placeholder. Every number is a live snapshot
// (see the "verified" note on each block) — re-run the ingest kits for
// current figures; what's stable is which markets exist, not the APY/TVL.

export interface LendMarket {
  ticker: string; venue: 'Morpho' | 'Kamino'; market: string; chain: string;
  borrow: string; ltv: number | null; apy: number | null; supplied: number | null;
  seeded?: boolean; // true = live but under $1k, i.e. a seeded/test market, not real liquidity
}

export interface LoopPair {
  ticker: string; market: string; borrow: string;
  apy: number | null; belowZero?: boolean; maxLeverage: number; liq: number; supplied: number;
}

export interface TrancheSplit {
  ticker: string; venue: string; link: string; split: string;
  feedsInto: 'lending' | 'loop'; // Strata/3jane/Royco just split (lending-adjacent);
                                   // Exponent/Pendle produce a PT posted as collateral (loop-adjacent)
}

export interface Allocator {
  name: string; link: string; desc: string; tokens: string; // e.g. "JAAA · STAC"
}

// ---- LENDING: verified against Morpho GraphQL + Kamino REST, this session ----
export const LEND_MARKETS: Record<string, LendMarket[]> = {
  AA_FalconXUSDC: [
    { ticker: 'AA_FalconXUSDC', venue: 'Morpho', market: 'FalconX Vault', chain: 'ethereum', borrow: 'USDC', ltv: 0.770, apy: 0.0722, supplied: 36188852 },
  ],
  'mF-ONE': [
    { ticker: 'mF-ONE', venue: 'Morpho', market: 'MF-ONE Pool', chain: 'ethereum', borrow: 'USDC', ltv: 0.915, apy: 0.0650, supplied: 25749378 },
    { ticker: 'mF-ONE', venue: 'Kamino', market: 'MF-ONE Pool', chain: 'solana', borrow: 'USDC', ltv: 0.80, apy: 0.0250, supplied: 0, seeded: true },
    { ticker: 'mF-ONE', venue: 'Kamino', market: 'MF-ONE Pool', chain: 'solana', borrow: 'USDG', ltv: 0.80, apy: 0.0250, supplied: 0, seeded: true },
  ],
  USD3: [
    { ticker: 'USD3', venue: 'Morpho', market: 'USD3 Pool', chain: 'ethereum', borrow: 'USDC', ltv: 0.915, apy: 0.0661, supplied: 16551953 },
    { ticker: 'USD3', venue: 'Morpho', market: 'USD3 Pool', chain: 'ethereum', borrow: 'eUSD', ltv: 0.860, apy: 0.0003, supplied: 6, seeded: true },
  ],
  PST: [
    { ticker: 'PST', venue: 'Morpho', market: 'Huma Pool', chain: 'ethereum', borrow: 'AUSD', ltv: 0.860, apy: 0.0627, supplied: 9932829 },
    { ticker: 'PST', venue: 'Kamino', market: 'Huma Market', chain: 'solana', borrow: 'USDC', ltv: 0.75, apy: 0.0550, supplied: 45.6e6 },
    { ticker: 'PST', venue: 'Kamino', market: 'Huma Market', chain: 'solana', borrow: 'USDS', ltv: 0.75, apy: 0.0299, supplied: 45.6e6 },
    { ticker: 'PST', venue: 'Kamino', market: 'Huma Market', chain: 'solana', borrow: 'USDG', ltv: 0.75, apy: 0.0167, supplied: 45.6e6 },
  ],
  syrupUSDC: [
    { ticker: 'syrupUSDC', venue: 'Morpho', market: 'Maple Pool', chain: 'arbitrum', borrow: 'USDC', ltv: 0.915, apy: 0.1081, supplied: 38441 },
    { ticker: 'syrupUSDC', venue: 'Morpho', market: 'Maple Pool', chain: 'polygon', borrow: 'AUSD', ltv: 0.915, apy: 0.0196, supplied: 1, seeded: true },
    { ticker: 'syrupUSDC', venue: 'Kamino', market: 'Maple Market', chain: 'solana', borrow: 'PYUSD', ltv: 0.88, apy: 0.0397, supplied: 74.2e6 },
    { ticker: 'syrupUSDC', venue: 'Kamino', market: 'Maple Market', chain: 'solana', borrow: 'USDC', ltv: 0.88, apy: 0.0485, supplied: 74.2e6 },
    { ticker: 'syrupUSDC', venue: 'Kamino', market: 'Maple Market', chain: 'solana', borrow: 'USDS', ltv: 0.88, apy: 0.0250, supplied: 74.2e6 },
    { ticker: 'syrupUSDC', venue: 'Kamino', market: 'Maple Market', chain: 'solana', borrow: 'CASH', ltv: 0.88, apy: 0.0411, supplied: 74.2e6 },
    { ticker: 'syrupUSDC', venue: 'Kamino', market: 'Maple Market', chain: 'solana', borrow: 'USD1', ltv: 0.88, apy: 0.1588, supplied: 74.2e6 },
    { ticker: 'syrupUSDC', venue: 'Kamino', market: 'Maple Market', chain: 'solana', borrow: 'USDG', ltv: 0.88, apy: 0.0483, supplied: 74.2e6 },
  ],
  PRIME: [
    { ticker: 'PRIME', venue: 'Morpho', market: 'Prime Pool', chain: 'ethereum', borrow: 'AUSD', ltv: 0.860, apy: 0.0540, supplied: 12484, seeded: true },
    { ticker: 'PRIME', venue: 'Kamino', market: 'Figure Market', chain: 'solana', borrow: 'PYUSD', ltv: 0.88, apy: 0.0503, supplied: 100.4e6 },
    { ticker: 'PRIME', venue: 'Kamino', market: 'Figure Market', chain: 'solana', borrow: 'wYLDS', ltv: 0.88, apy: 0.0550, supplied: 100.4e6 },
    { ticker: 'PRIME', venue: 'Kamino', market: 'Figure Market', chain: 'solana', borrow: 'USDS', ltv: 0.88, apy: 0.0766, supplied: 100.4e6 },
    { ticker: 'PRIME', venue: 'Kamino', market: 'Figure Market', chain: 'solana', borrow: 'USDC', ltv: 0.88, apy: 0.0663, supplied: 100.4e6 },
    { ticker: 'PRIME', venue: 'Kamino', market: 'Figure Market', chain: 'solana', borrow: 'USDT', ltv: 0.88, apy: 0.0750, supplied: 100.4e6 },
    { ticker: 'PRIME', venue: 'Kamino', market: 'Figure Market', chain: 'solana', borrow: 'CASH', ltv: 0.88, apy: 0.0504, supplied: 100.4e6 },
  ],
  ONyc: [
    { ticker: 'ONyc', venue: 'Kamino', market: 'OnRe Market', chain: 'solana', borrow: 'USDC', ltv: 0.66, apy: 0.0986, supplied: 198.1e6 },
    { ticker: 'ONyc', venue: 'Kamino', market: 'OnRe Market', chain: 'solana', borrow: 'AUSD', ltv: 0.66, apy: 0.0, supplied: 198.1e6 },
    { ticker: 'ONyc', venue: 'Kamino', market: 'OnRe Market', chain: 'solana', borrow: 'USDS', ltv: 0.66, apy: 0.0830, supplied: 198.1e6 },
    { ticker: 'ONyc', venue: 'Kamino', market: 'OnRe Market', chain: 'solana', borrow: 'USDT', ltv: 0.66, apy: 0.0, supplied: 198.1e6 },
    { ticker: 'ONyc', venue: 'Kamino', market: 'OnRe Market', chain: 'solana', borrow: 'USDG', ltv: 0.66, apy: 0.0933, supplied: 198.1e6 },
  ],
  AUTO: [
    { ticker: 'AUTO', venue: 'Kamino', market: 'AUTO Market', chain: 'solana', borrow: 'USDC', ltv: 0.65, apy: 0.0597, supplied: 9.3e6 },
    { ticker: 'AUTO', venue: 'Kamino', market: 'AUTO Market', chain: 'solana', borrow: 'PYUSD', ltv: 0.65, apy: 0.0591, supplied: 9.3e6 },
    { ticker: 'AUTO', venue: 'Kamino', market: 'AUTO Market', chain: 'solana', borrow: 'wYLDS', ltv: 0.65, apy: 0.0469, supplied: 9.3e6 },
  ],
  oTFY: [
    { ticker: 'oTFY', venue: 'Kamino', market: 'Obligate Market', chain: 'solana', borrow: 'USDC', ltv: 0.75, apy: 0.0647, supplied: 7.2e6 },
  ],
  reUSD: [
    { ticker: 'reUSD', venue: 'Morpho', market: 'reUSD Pool', chain: 'polygon', borrow: 'USDC', ltv: 0.915, apy: 0.0632, supplied: 1, seeded: true },
    { ticker: 'reUSD', venue: 'Morpho', market: 'reUSD Pool', chain: 'base', borrow: 'USDC', ltv: 0.915, apy: 0.0027, supplied: 0, seeded: true },
    { ticker: 'reUSD', venue: 'Kamino', market: 'reUSD Market', chain: 'solana', borrow: 'USDG', ltv: 0.80, apy: 0.0478, supplied: 12.3e6 },
    { ticker: 'reUSD', venue: 'Kamino', market: 'reUSD Market', chain: 'solana', borrow: 'USDC', ltv: 0.80, apy: 0.0756, supplied: 12.3e6 },
  ],
  nOPAL: [
    { ticker: 'nOPAL', venue: 'Kamino', market: 'nOPAL Market', chain: 'solana', borrow: 'USDC', ltv: 0.75, apy: 0.0342, supplied: 4.5e6 },
  ],
  JAAA: [
    { ticker: 'JAAA', venue: 'Morpho', market: 'JAAA Pool', chain: 'ethereum', borrow: 'USDC', ltv: 0.860, apy: 0.0027, supplied: 0, seeded: true },
  ],
  mGLOBAL: [
    { ticker: 'mGLOBAL', venue: 'Morpho', market: 'MGLOBAL Pool', chain: 'ethereum', borrow: 'USDC', ltv: 0.860, apy: 0.0027, supplied: 1, seeded: true },
  ],
  deCRDX: [
    { ticker: 'deCRDX', venue: 'Morpho', market: 'deCRDX Pool', chain: 'optimism', borrow: 'USDC', ltv: 0.625, apy: 0.0434, supplied: 4, seeded: true },
  ],
};

/** One known broken/test market, excluded from every table rather than silently dropped. */
export const BROKEN_MARKET = { ticker: 'PRIME', venue: 'Morpho', chain: 'ethereum', borrow: 'USDC', apy: 307.6969, supplied: 3, note: 'Anomalous test market — not a real rate.' };

// ---- LOOP: per-pair Max Leverage APY, read from Kamino's own Multiply screen ----
// Max leverage = 1 / (1 - max LTV), confirmed against the app (ONyc: 2.9x = 1/(1-0.66)).
// The `avgLeverage` field on Kamino's /leverage/metrics API is NOT this number —
// it's the current average across open positions, which is usually lower. Don't
// reintroduce that bug; see lib/ingest/kamino.ts for the corrected derivation.
export const LOOP_PAIRS: Record<string, LoopPair[]> = {
  AUTO: [
    { ticker: 'AUTO', market: 'AUTO Market', borrow: 'PYUSD', apy: 0.1147, maxLeverage: 2.9, liq: 389.06e3, supplied: 2.04e6 },
    { ticker: 'AUTO', market: 'AUTO Market', borrow: 'USDC', apy: 0.1136, maxLeverage: 2.9, liq: 225.70e3, supplied: 99.30e3 },
  ],
  PRIME: [
    { ticker: 'PRIME', market: 'Figure Market', borrow: 'CASH', apy: 0.1609, maxLeverage: 8.3, liq: 4.08e6, supplied: 18.98e6 },
    { ticker: 'PRIME', market: 'Figure Market', borrow: 'USDC', apy: 0.0431, maxLeverage: 8.3, liq: 0, supplied: 40.39e6 },
    { ticker: 'PRIME', market: 'Figure Market', borrow: 'PYUSD', apy: 0.1615, maxLeverage: 8.3, liq: 6.13e6, supplied: 25.90e6 },
    { ticker: 'PRIME', market: 'Figure Market', borrow: 'USDS', apy: null, belowZero: true, maxLeverage: 8.3, liq: 0, supplied: 575.36e3 },
  ],
  reUSD: [
    { ticker: 'reUSD', market: 'reUSD Market', borrow: 'USDC', apy: 0.0382, maxLeverage: 5.0, liq: 5.71e3, supplied: 540.53e3 },
    { ticker: 'reUSD', market: 'reUSD Market', borrow: 'USDG', apy: 0.1477, maxLeverage: 5.0, liq: 265.13e3, supplied: 950.37e3 },
  ],
  syrupUSDC: [
    { ticker: 'syrupUSDC', market: 'Maple Market', borrow: 'USDC', apy: 0.0620, maxLeverage: 8.3, liq: 107.33e3, supplied: 969.07e3 },
    { ticker: 'syrupUSDC', market: 'Maple Market', borrow: 'USDG', apy: 0.0607, maxLeverage: 8.3, liq: 77.85e3, supplied: 915.27e3 },
    { ticker: 'syrupUSDC', market: 'Maple Market', borrow: 'USDS', apy: 0.2306, maxLeverage: 8.3, liq: 31.70e3, supplied: 47.12e3 },
    { ticker: 'syrupUSDC', market: 'Maple Market', borrow: 'CASH', apy: 0.1130, maxLeverage: 8.3, liq: 14.59e3, supplied: 155.26e3 },
    { ticker: 'syrupUSDC', market: 'Maple Market', borrow: 'PYUSD', apy: 0.1233, maxLeverage: 8.3, liq: 5.99e6, supplied: 55.40e6 },
  ],
  ONyc: [
    { ticker: 'ONyc', market: 'OnRe Market', borrow: 'USDC', apy: 0.1825, maxLeverage: 2.9, liq: 0, supplied: 92.34e6 },
    { ticker: 'ONyc', market: 'OnRe Market', borrow: 'USDG', apy: 0.1735, maxLeverage: 2.9, liq: 0, supplied: 23.87e6 },
    { ticker: 'ONyc', market: 'OnRe Market', borrow: 'USDS', apy: 0.1630, maxLeverage: 2.9, liq: 0, supplied: 1.21e6 },
  ],
  PST: [
    { ticker: 'PST', market: 'Huma Market', borrow: 'USDC', apy: 0.1548, maxLeverage: 4.0, liq: 1.64e6, supplied: 3.55e6 },
  ],
};

// ---- TRANCHE: hand-verified from each project's own site ----
export const TRANCHE_SPLITS: TrancheSplit[] = [
  { ticker: 'PRIME', venue: 'Strata', link: 'https://strata.markets', split: 'srPRIME + jrPRIME', feedsInto: 'lending' },
  { ticker: 'nOPAL', venue: 'Strata', link: 'https://strata.markets', split: 'srnOPAL + jrnOPAL', feedsInto: 'lending' },
  { ticker: 'USD3', venue: '3jane', link: 'https://3jane.xyz', split: 'USD3 (senior) + sUSD3 (junior)', feedsInto: 'lending' },
  { ticker: 'mGLOBAL', venue: 'Royco', link: 'https://royco.org', split: 'Dawn senior + Dawn junior', feedsInto: 'lending' },
  { ticker: 'ONyc', venue: 'Exponent', link: 'https://exponent.finance', split: 'srONyc + jrONyc', feedsInto: 'loop' },
  { ticker: 'ONyc', venue: 'Exponent', link: 'https://exponent.finance', split: 'PT-srONyc + YT-srONyc (of srONyc)', feedsInto: 'loop' },
  { ticker: 'syrupUSDC', venue: 'Pendle', link: 'https://app.pendle.finance', split: 'PT + YT', feedsInto: 'loop' },
  { ticker: 'PRIME', venue: 'Pendle', link: 'https://app.pendle.finance', split: 'PT + YT', feedsInto: 'loop' },
];

// ---- ALLOCATOR: hand-verified from each project's own site ----
export const ALLOCATORS: Allocator[] = [
  { name: 'InfiniFi', link: 'https://infinifi.xyz', desc: 'Duration-matched yield protocol. Locked deposits go into tokenized receivables.', tokens: 'mGLOBAL · Fasanara / mF-ONE sleeve' },
  { name: 'Noon', link: 'https://noon.capital', desc: 'Yield-bearing dollar with an explicit private-credit and CLO sleeve.', tokens: 'Fasanara F-TAC · JAAA' },
  { name: 'Ethena', link: 'https://ethena.fi', desc: 'USDe reserve buyer. Credit is backing, not a loop product.', tokens: 'JAAA' },
  { name: 'Grove', link: 'https://grove.finance', desc: 'Executes Sky\u2019s onchain credit book.', tokens: 'JAAA · STAC' },
  { name: 'Sky', link: 'https://sky.money', desc: 'Approves Grove size. Same positions as Grove.', tokens: 'JAAA · STAC' },
  { name: 'Resolv', link: 'https://resolv.xyz', desc: 'USR backing. Holds JAAA and posts it on Aave Horizon.', tokens: 'JAAA' },
  { name: 'Ember', link: 'https://ember.so', desc: 'Product wrapper for permissioned credit vaults.', tokens: 'Goblin Private Credit I / pAlpha' },
];
