// lib/addresses.ts
// The join key for everything. Match markets on ADDRESS, never on name —
// one ticker has different addresses per chain, and wrappers (wJAAA) are
// their own address that maps back to the base ticker.
//
// TODO: fill every `address: ''`. This is the one manual, one-time step.
// Get addresses from each issuer's docs or the token page on the chain's explorer.

export interface TokenAddress {
  ticker: string;    // must match Asset.t in lib/data.ts
  chain: Chain;
  address: string;   // checksummed 0x hex (EVM) or base58 mint (Solana)
  isWrapper: boolean;
  wrapperOf?: string; // base ticker this wraps, e.g. 'JAAA' for wJAAA
}

export type Chain = 'ethereum' | 'polygon' | 'optimism' | 'base' | 'solana';

export const TOKEN_ADDRESSES: TokenAddress[] = [
  // ACRED — Apollo / Securitize
  { ticker: 'ACRED', chain: 'ethereum', address: '', isWrapper: false },
  { ticker: 'ACRED', chain: 'polygon',  address: '', isWrapper: false },
  { ticker: 'ACRED', chain: 'optimism', address: '', isWrapper: false },
  { ticker: 'ACRED', chain: 'solana',   address: '', isWrapper: false }, // Kamino/Loopscale

  // PRIME — Figure / Hastra
  { ticker: 'PRIME', chain: 'solana',   address: '', isWrapper: false }, // Kamino
  { ticker: 'PRIME', chain: 'ethereum', address: '', isWrapper: false }, // Morpho PYUSD mkt

  // ONyc — OnRe
  { ticker: 'ONyc', chain: 'solana', address: '', isWrapper: false },

  // mF-ONE — Fasanara / Midas
  { ticker: 'mF-ONE', chain: 'ethereum', address: '', isWrapper: false },

  // JAAA — Janus Henderson / Centrifuge  (wJAAA is what Morpho takes)
  { ticker: 'JAAA', chain: 'ethereum', address: '', isWrapper: false },
  { ticker: 'JAAA', chain: 'ethereum', address: '', isWrapper: true, wrapperOf: 'JAAA' }, // wJAAA

  // HINC — Neuberger Berman / Securitize
  { ticker: 'HINC', chain: 'solana', address: '', isWrapper: false }, // Loopscale

  // syrupUSDC — Maple
  { ticker: 'syrupUSDC', chain: 'ethereum', address: '', isWrapper: false },
];

/** address -> base ticker. Wrappers resolve to what they wrap. */
export function resolveTicker(chain: string, address: string): { ticker: string; wrapper: boolean } | null {
  const hit = TOKEN_ADDRESSES.find(
    (t) => t.chain === chain && t.address && t.address.toLowerCase() === address.toLowerCase(),
  );
  if (!hit) return null;
  return { ticker: hit.wrapperOf ?? hit.ticker, wrapper: hit.isWrapper };
}
