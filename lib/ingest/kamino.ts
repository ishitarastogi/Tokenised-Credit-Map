// Kamino — Solana. REST returns reserve symbol + metrics.
// Endpoint shape per kamino.com/docs; adjust the path if theirs differs.
import type { RawMarket } from './types';

const BASE = 'https://api.kamino.finance';

export async function fetchKamino(): Promise<RawMarket[]> {
  // Main market reserves. Some deployments namespace by market pubkey.
  const res = await fetch(`${BASE}/kamino-market/reserves/metrics`);
  if (!res.ok) return [];
  const data = await res.json();
  const reserves = Array.isArray(data) ? data : (data?.reserves ?? []);
  return reserves.map((r: any): RawMarket => ({
    venue: 'kamino',
    surface: 'Lend',
    chain: 'solana',
    collateralAddress: r.liquidityMint ?? r.mint ?? '',
    collateralSymbol: r.symbol ?? '',
    borrowAddress: r.liquidityMint ?? r.mint ?? '',
    borrowSymbol: r.symbol ?? '',
    lltv: r.loanToValuePct != null ? (r.loanToValuePct / 100).toFixed(4) : null,
    rateType: 'variable',
    borrowApy: r.borrowApy ?? null,
    supplyApy: r.supplyApy ?? null,
    totalSupplyUsd: r.totalSupplyUsd ?? null,
    totalBorrowUsd: r.totalBorrowUsd ?? null,
    utilization: r.utilization ?? null,
    curator: null,
    raw: r,
  }));
}
