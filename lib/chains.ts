// lib/chains.ts — chain badge metadata for the "Networks" column.
// Small hand-authored marks (not fetched assets) so every chain in the sheet
// renders with its own brand color and a recognizable shape, offline.

export type ChainMark = 'diamond' | 'hexagon' | 'triangle' | 'bars' | 'letter';

export interface ChainMeta {
  label: string;
  color: string;
  mark: ChainMark;
  /** Shown inside 'letter' marks; defaults to the label's first character. */
  glyph?: string;
}

/** Fixes for casing/typo variants that show up in the source sheet. */
const CHAIN_ALIASES: Record<string, string> = {
  aavalance: 'Avalanche',
  'bnb chain': 'BNB Chain',
  optimism: 'Optimism',
};

export const CHAIN_META: Record<string, ChainMeta> = {
  Ethereum: { label: 'Ethereum', color: '#627EEA', mark: 'diamond' },
  Solana: { label: 'Solana', color: '#9945FF', mark: 'bars' },
  Polygon: { label: 'Polygon', color: '#8247E5', mark: 'hexagon' },
  Avalanche: { label: 'Avalanche', color: '#E84142', mark: 'triangle' },
  Arbitrum: { label: 'Arbitrum', color: '#1B4ADD', mark: 'letter', glyph: 'Ar' },
  Optimism: { label: 'Optimism', color: '#FF0420', mark: 'letter', glyph: 'Op' },
  Base: { label: 'Base', color: '#0052FF', mark: 'letter', glyph: 'B' },
  'BNB Chain': { label: 'BNB Chain', color: '#F0B90B', mark: 'diamond' },
  Stellar: { label: 'Stellar', color: '#0B0B0F', mark: 'letter', glyph: '*' },
  Hedera: { label: 'Hedera', color: '#000000', mark: 'letter', glyph: 'H' },
  Aptos: { label: 'Aptos', color: '#00D0B0', mark: 'letter', glyph: 'A' },
  Sei: { label: 'Sei', color: '#9E1F19', mark: 'letter', glyph: 'S' },
  Ink: { label: 'Ink', color: '#7132F5', mark: 'letter', glyph: 'I' },
  Monad: { label: 'Monad', color: '#836EF9', mark: 'letter', glyph: 'M' },
  Plume: { label: 'Plume', color: '#FF6A3D', mark: 'letter', glyph: 'P' },
  Pharos: { label: 'Pharos', color: '#14B8A6', mark: 'letter', glyph: 'Ph' },
  Tron: { label: 'Tron', color: '#EF0027', mark: 'letter', glyph: 'T' },
  XDC: { label: 'XDC', color: '#F7941D', mark: 'letter', glyph: 'X' },
  XRPL: { label: 'XRPL', color: '#23292F', mark: 'letter', glyph: 'X' },
  Near: { label: 'Near', color: '#000000', mark: 'letter', glyph: 'N' },
  Robinhood: { label: 'Robinhood', color: '#00C805', mark: 'letter', glyph: 'R' },
  'Liquid Network': { label: 'Liquid Network', color: '#039BE5', mark: 'letter', glyph: 'L' },
  'Multi-chain': { label: 'Multi-chain', color: '#6A757E', mark: 'letter', glyph: '+' },
};

const normalizeOne = (raw: string): string => {
  const trimmed = raw.trim();
  const fixed = CHAIN_ALIASES[trimmed.toLowerCase()];
  return fixed ?? trimmed;
};

/** Parses the "Ethereum, Solana" style string into a deduped, normalized chain list. */
export const parseNetworks = (raw: string): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const chunk of raw.split(',')) {
    const c = chunk.trim();
    if (!c || c === '—') continue;
    const name = normalizeOne(c);
    if (!seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
};

export const chainMeta = (name: string): ChainMeta =>
  CHAIN_META[name] ?? { label: name, color: '#8A949C', mark: 'letter', glyph: name.charAt(0).toUpperCase() };
