// Euler — public metadata endpoint. Richest naming: returns asset.symbol,
// asset.name, decimals, and the curating entity. No API key needed.
import type { RawMarket } from './types';

const BASE = 'https://app.euler.finance/api/public';
const CHAIN: Record<number, string> = { 1: 'ethereum', 8453: 'base', 42161: 'arbitrum' };

export async function fetchEuler(chainId = 1): Promise<RawMarket[]> {
  const list = await (await fetch(`${BASE}/metadata?chainId=${chainId}`)).json();
  const vaults = Object.values(list ?? {}) as any[];
  return vaults
    .filter((v) => v?.asset?.address)
    .map((v): RawMarket => ({
      venue: 'euler',
      surface: 'EVK',
      chain: CHAIN[chainId] ?? String(chainId),
      collateralAddress: v.asset.address,
      collateralSymbol: v.asset.symbol,
      borrowAddress: v.asset.address, // EVK: same vault lends its own asset; pair comes from LTV config
      borrowSymbol: v.asset.symbol,
      lltv: null,          // read per collateral pair from vault config, add later
      rateType: 'variable',
      borrowApy: null, supplyApy: null, totalSupplyUsd: null, totalBorrowUsd: null, utilization: null,
      curator: v.entities?.[0]?.name ?? null,
      raw: v,
    }));
}
