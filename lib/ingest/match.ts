// Match raw markets to your token dataset by address. Anything that doesn't
// match is a MISS — either a token you haven't onboarded, or an address you
// still need to fill in addresses.ts. Never dropped silently.
import { resolveTicker } from '@/lib/addresses';
import type { MatchedMarket, RawMarket } from './types';

export interface MatchResult {
  matched: MatchedMarket[];
  misses: { collateralAddress: string; collateralSymbol: string; venue: string; chain: string }[];
}

export function matchMarkets(raw: RawMarket[]): MatchResult {
  const matched: MatchedMarket[] = [];
  const misses: MatchResult['misses'] = [];
  for (const m of raw) {
    const hit = resolveTicker(m.chain, m.collateralAddress);
    if (!hit) {
      misses.push({ collateralAddress: m.collateralAddress, collateralSymbol: m.collateralSymbol, venue: m.venue, chain: m.chain });
      continue;
    }
    matched.push({ ...m, ticker: hit.ticker, postedAsWrapper: hit.wrapper });
  }
  return { matched, misses };
}
