// lib/logos.ts — logo lookup.
//
// Files live in /public/logos/<slug>.<ext>. The slug map below is the same
// one from your projects.ts audit: only logos verified from a project's own
// site are listed. Anything missing falls back to a monogram, so the UI never
// guesses or shows a broken image.

export const VERIFIED_LOGOS: Record<string, string> = {
  '3f': '/logos/3f.svg',
  '3jane': '/logos/3jane.svg',
  aave: '/logos/aave.svg',
  'adaptive-frontier': '/logos/adaptive-frontier.svg',
  agridex: '/logos/agridex.svg',
  apollo: '/logos/apollo.svg',
  'berkeley-square-finance-group': '/logos/berkeley-square-finance-group.svg',
  bitbond: '/logos/bitbond.png',
  blackopal: '/logos/blackopal.png',
  cap: '/logos/cap.png',
  centrifuge: '/logos/centrifuge.svg',
  chainlink: '/logos/chainlink.svg',
  clearpool: '/logos/clearpool.svg',
  coinshift: '/logos/coinshift.svg',
  'credible-finance': '/logos/credible-finance.svg',
  'credit-coop': '/logos/credit-coop.svg',
  credix: '/logos/credix.png',
  'csigma-finance': '/logos/csigma-finance.png',
  ethena: '/logos/ethena.svg',
  ethichub: '/logos/ethichub.svg',
  falconx: '/logos/falconx.svg',
  fasanara: '/logos/fasanara.png',
  figure: '/logos/figure.svg',
  'galaxy-asset-management': '/logos/galaxy-asset-management.svg',
  goblin: '/logos/goblin.svg',
  goldfinch: '/logos/goldfinch.png',
  'hamilton-lane': '/logos/hamilton-lane.svg',
  'harvest-flow': '/logos/harvest-flow.svg',
  hastra: '/logos/hastra.png',
  'huma-finance': '/logos/huma-finance.svg',
  infinifi: '/logos/infinifi.svg',
  intain: '/logos/intain.png',
  'isle-finance': '/logos/isle-finance.png',
  'janus-henderson': '/logos/janus-henderson.svg',
  kaio: '/logos/kaio.svg',
  kasu: '/logos/kasu.svg',
  'keyring-network': '/logos/keyring-network.svg',
  liqi: '/logos/liqi.svg',
  'maple-finance': '/logos/maple-finance.png',
  midas: '/logos/midas.png',
  morpho: '/logos/morpho.svg',
  'nest-credit': '/logos/nest-credit.svg',
  noon: '/logos/noon.png',
  obligate: '/logos/obligate.png',
  onre: '/logos/onre.svg',
  openfi: '/logos/openfi.png',
  pareto: '/logos/pareto.svg',
  'pharos-network': '/logos/pharos-network.png',
  plume: '/logos/plume.svg',
  provenance: '/logos/provenance.png',
  r25: '/logos/r25.svg',
  're-protocol': '/logos/re-protocol.svg',
  redstone: '/logos/redstone.svg',
  'robbin-pagamentos': '/logos/robbin-pagamentos.svg',
  securitize: '/logos/securitize.svg',
  'strata-markets': '/logos/strata-markets.png',
  sukukfi: '/logos/sukukfi.svg',
  tradable: '/logos/tradable.svg',
  'travessia-credit': '/logos/travessia-credit.png',
  turtle: '/logos/turtle.svg',
  'untangled-finance': '/logos/untangled-finance.svg',
  'usd-ai': '/logos/usd-ai.svg',
  'vert-capital': '/logos/vert-capital.svg',
  wisdomtree: '/logos/wisdomtree.svg',
  zivoe: '/logos/zivoe.svg',
};

/** Names in our dataset that don't slugify to the logo file's slug. */
const ALIASES: Record<string, string> = {
  maple: 'maple-finance',
  huma: 'huma-finance',
  're': 're-protocol',
  'falconx-m11-credit': 'falconx',
  'galaxy-digital': 'galaxy-asset-management',
  'plume-nest': 'nest-credit',
  'plume-vaults': 'plume',
  'insight-investment': 'insight',
  'hamilton-lane': 'hamilton-lane',
  'csigma-finance': 'csigma-finance',
};

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Path to a verified logo file, or null when we don't have one. */
export const logoFor = (name: string): string | null => {
  const slug = slugify(name);
  return VERIFIED_LOGOS[ALIASES[slug] ?? slug] ?? null;
};
