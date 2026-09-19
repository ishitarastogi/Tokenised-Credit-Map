// Tranche — Pendle v2 public API (api-v2.pendle.finance), no key.
// Returns PT/YT, implied APY, PT discount, liquidity, maturity, with symbols.
import type { RawTranche } from './types';

const BASE = 'https://api-v2.pendle.finance/core/v1';
const CHAINS: Record<number, string> = { 1: 'ethereum', 42161: 'arbitrum', 8453: 'base', 56: 'bnb' };

export async function fetchPendle(): Promise<RawTranche[]> {
  const out: RawTranche[] = [];
  for (const [id, chain] of Object.entries(CHAINS)) {
    try {
      const res = await fetch(`${BASE}/${id}/markets/active`);
      if (!res.ok) continue;
      const json = await res.json();
      const markets = json?.markets ?? json ?? [];
      for (const m of markets) {
        out.push({
          venue: 'pendle',
          chain,
          underlyingAddress: m.underlyingAsset?.address ?? m.sy?.address ?? '',
          underlyingSymbol: m.underlyingAsset?.symbol ?? m.symbol ?? '',
          ptAddress: m.pt?.address ?? null,
          ytAddress: m.yt?.address ?? null,
          impliedApy: m.impliedApy ?? m.details?.impliedApy ?? null,
          ptDiscount: m.ptDiscount ?? m.details?.ptDiscount ?? null,
          liquidityUsd: m.liquidity?.usd ?? m.details?.liquidity ?? null,
          maturity: m.expiry ?? m.maturity ?? null,
          raw: m,
        });
      }
    } catch { /* skip chain on error */ }
  }
  return out;
}
