// Loop engine — DERIVED, not fetched. A loop sits on a lending market, so its
// numbers come from that market plus the collateral's own yield.
// net APY on equity ≈ fundApy + (fundApy - borrowApy) * (leverage - 1)
import type { RawLoop, RawMarket } from './types';

// Which engine runs on which venue. Extend as you confirm more.
const ENGINE_BY_VENUE: Record<string, RawLoop['engine'][]> = {
  morpho: ['3F', 'Gauntlet Aera'],
  kamino: ['Kamino Multiply'],
  loopscale: ['Loopscale Loops'],
};

// Fund yield per collateral ticker (the credit token's own APY). Fill from
// issuer NAV data; left null until you have it, so netApy stays honest.
const FUND_APY: Record<string, number> = {
  // ACRED: 0.09, PRIME: 0.11, ...
};

export function deriveLoops(markets: RawMarket[], tickerOf: (chain: string, addr: string) => string | null): RawLoop[] {
  const out: RawLoop[] = [];
  for (const m of markets) {
    const engines = ENGINE_BY_VENUE[m.venue];
    if (!engines) continue;
    const ticker = tickerOf(m.chain, m.collateralAddress);
    const fundApy = ticker ? (FUND_APY[ticker] ?? null) : null;
    const maxLev = m.lltv ? +(1 / (1 - Number(m.lltv))).toFixed(2) : null;
    const net =
      fundApy != null && m.borrowApy != null && maxLev != null
        ? +(fundApy + (fundApy - m.borrowApy) * (maxLev - 1)).toFixed(4)
        : null;
    for (const engine of engines) {
      out.push({
        engine,
        underlyingVenue: `${m.venue} ${m.surface}`,
        chain: m.chain,
        collateralAddress: m.collateralAddress,
        collateralSymbol: m.collateralSymbol,
        fundApy,
        borrowApy: m.borrowApy,
        netApyOnEquity: net,
        maxLeverage: maxLev,
        settlement: 'one-click',
        raw: { fromMarket: m.venue + ':' + m.collateralSymbol },
      });
    }
  }
  return out;
}
