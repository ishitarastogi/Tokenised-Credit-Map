// Loopscale — Solana. The quote API takes token addresses IN and does NOT
// return a symbol, so we resolve the mint against TOKEN_ADDRESSES ourselves.
// Partner endpoint; you may need access. Feed it the mints you care about.
import type { RawMarket } from './types';

const BASE = 'https://tars.loopscale.com/v1';

export async function fetchLoopscale(collateralMints: string[]): Promise<RawMarket[]> {
  const out: RawMarket[] = [];
  for (const mint of collateralMints) {
    try {
      const res = await fetch(`${BASE}/markets/quote?collateral=${mint}`);
      if (!res.ok) continue;
      const q = await res.json();
      out.push({
        venue: 'loopscale',
        surface: 'Credit Order Book',
        chain: 'solana',
        collateralAddress: mint,
        collateralSymbol: '',            // not returned — resolve from address later
        borrowAddress: q.principalMint ?? '',
        borrowSymbol: q.principalSymbol ?? '',
        lltv: q.maxLtv != null ? String(q.maxLtv) : null,
        rateType: 'fixed',
        borrowApy: q.apy ?? null,
        supplyApy: null,
        totalSupplyUsd: null,
        totalBorrowUsd: q.maxPrincipalAvailable ?? null,
        utilization: null,
        curator: null,
        raw: q,
      });
    } catch { /* skip mints with no live market */ }
  }
  return out;
}
