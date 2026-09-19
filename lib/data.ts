// lib/data.ts — single source of truth for the site.
// Sourced from the finalised platform/token sheet. Adding a token = adding
// one A(...) line to the right platform.

export type OriginKey = 'tradfi' | 'onchain' | 'direct';
export type Kind = 'Corporate Credit' | 'Diversified Credit' | 'Specialty Finance' | 'Asset-Backed Credit';

export interface Asset {
  /** Ticker, e.g. ACRED */
  t: string;
  /** Full asset name */
  n: string;
  /** Firm that manages/mints the token */
  issuer: string;
  /** Filterable kind */
  kind: Kind;
  /** Comma-separated chains the token lives on, e.g. "Ethereum, Solana" */
  networks: string;
  /** Raw origin label from the source sheet, e.g. "TradFi manager" — finer-grained than Platform.origin */
  originLabel: string;
  /** Finer label shown in the UI, e.g. "Fund share" */
  detail: string;
}

export interface Platform {
  /** Tokenization platform that runs the credit */
  name: string;
  origin: OriginKey;
  assets: Asset[];
}

export interface OriginMeta {
  label: string; short: string; role: string; color: string; tint: string; text: string;
}

export interface KindMeta {
  label: string; color: string; tint: string; text: string;
}

const A = (t: string, n: string, issuer: string, kind: Kind, networks: string, originLabel: string, detail?: string): Asset => ({
  t, n, issuer, kind, networks, originLabel, detail: detail ?? kind,
});
const P = (name: string, origin: OriginKey, assets: Asset[]): Platform => ({ name, origin, assets });

const CC: Kind = 'Corporate Credit';
const DC: Kind = 'Diversified Credit';
const SF: Kind = 'Specialty Finance';
const ABC: Kind = 'Asset-Backed Credit';

export const ORIGINS: Record<OriginKey, OriginMeta> = {
  tradfi: { label: 'TradFi managers', short: 'TradFi', role: 'TradFi manager', color: '#0E7C6B', tint: '#E3F2EE', text: '#0B6457' },
  onchain: { label: 'Onchain platforms', short: 'Onchain', role: 'Onchain platform', color: '#4F5FD9', tint: '#EAECFB', text: '#3342A8' },
  direct: { label: 'Direct originators', short: 'Originators', role: 'Direct originator', color: '#C27617', tint: '#FBEFDD', text: '#8E520A' },
};

export const ORIGIN_ORDER: OriginKey[] = ['tradfi', 'onchain', 'direct'];
export const KINDS: (Kind | 'All')[] = ['All', 'Corporate Credit', 'Diversified Credit', 'Specialty Finance', 'Asset-Backed Credit'];

export const KIND_META: Record<Kind, KindMeta> = {
  'Corporate Credit': { label: 'Corporate Credit', color: '#0E7C6B', tint: '#E3F2EE', text: '#0B6457' },
  'Diversified Credit': { label: 'Diversified Credit', color: '#4F5FD9', tint: '#EAECFB', text: '#3342A8' },
  'Specialty Finance': { label: 'Specialty Finance', color: '#B23B5E', tint: '#FBE7ED', text: '#8E2A45' },
  'Asset-Backed Credit': { label: 'Asset-Backed Credit', color: '#C27617', tint: '#FBEFDD', text: '#8E520A' },
};
export const KIND_ORDER: Kind[] = ['Corporate Credit', 'Diversified Credit', 'Specialty Finance', 'Asset-Backed Credit'];

export const PLATFORMS: Platform[] = [
      // TradFi managers
  P('Centrifuge', 'tradfi', [A('JAAA', 'Janus Henderson AAA CLO Fund', 'Anemoy', CC, 'Ethereum, Avalanche, Solana, Base, Stellar, BNB Chain, Monad, Arbitrum', 'TradFi manager', 'Fund share'), A('ACRDX', 'Anemoy Tokenized Apollo Diversified Credit', 'Anemoy', DC, 'Ethereum, Plume, Base, Monad', 'TradFi manager', 'Fund share'), A('deJAAA', 'JAAA deRWA', 'Anemoy', CC, 'Ethereum, Stellar, Base, Solana, Arbitrum, Avalanche', 'TradFi manager', 'Distribution wrapper of JAAA'), A('HYB', 'NYLIM US High Yield Bond Fund', 'Anemoy', CC, 'Pharos, Ethereum, Avalanche', 'TradFi manager', 'Fund share'), A('deCRDX', 'ACRDX deRWA', 'Anemoy', DC, 'Optimism', 'TradFi manager', 'Distribution wrapper of ACRDX')]),
  P('J.P. Morgan', 'tradfi', [A('US36317HAA23', 'Galaxy Tokenized U.S. Commercial Paper (US36317HAA23)', 'J.P. Morgan', CC, 'Solana', 'TradFi / desk', 'Note ($0 TVL)')]),
  P('KAIO', 'tradfi', [A('SCOPEx', 'Hamilton Lane Senior Credit Opportunities Fund (KAIO Tokenized)', 'Hamilton Lane', CC, 'XDC, Solana, Sei, Polygon, Near, Hedera, Ethereum, Avalanche, Aptos', 'TradFi manager', 'Fund share')]),
  P('Midas', 'tradfi', [A('mGLOBAL', 'Midas Fasanara Global', 'Fasanara', ABC, 'Ethereum', 'TradFi manager', 'Tracker note'), A('mF-ONE', 'Midas mF-ONE', 'Fasanara', DC, 'Ethereum', 'TradFi manager', 'Tracker note'), A('mGLO', 'Midas Fasanara Global Open', 'Fasanara', ABC, 'Robinhood, Base', 'TradFi manager', 'Tracker note'), A('mWIN', 'Midas mWIN', 'Wellington', DC, 'Ethereum', 'TradFi manager', 'Tracker note')]),
  P('Mu Digital', 'tradfi', [A('muBOND', 'muBOND', 'Golden Hill Asset Management', CC, 'Ethereum, Monad', 'TradFi / manager', 'Note'), A('loAZND', 'loAZND', 'Golden Hill Asset Management', CC, 'Ethereum, Monad', 'TradFi / manager', 'Note')]),
  P('OpenEden Digital', 'tradfi', [A('HYBOND', 'Tokenized BNY Mellon Global Short-Dated Yield Bond Fund', 'Insight Investments', CC, 'Ethereum, BNB Chain', 'TradFi manager', 'Fund share')]),
  P('Securitize', 'tradfi', [A('STAC', 'Securitize AAA CLO Tokenized Fund', 'Securitize Capital', CC, 'Solana, Ethereum', 'TradFi manager', 'Fund share'), A('ACRED', 'Apollo Diversified Credit Securitize Fund', 'Securitize Capital', DC, 'Ethereum, Solana, Aptos, Sei, Ink, Avalanche, Polygon', 'TradFi manager', 'Fund share'), A('HINC', 'Neuberger Securitize High Income', 'Securitize Capital', CC, 'Solana, Ethereum, Avalanche', 'TradFi manager', 'Fund share'), A('RE', 'Re Member Fund LP', 'Re Member Fund', SF, 'Avalanche', 'Direct / specialty', 'Fund share'), A('HLSCOPE', 'Hamilton Lane Senior Credit Opportunities', 'Securitize Capital', CC, 'Polygon, Ethereum, Optimism, Plume, Tron', 'TradFi manager', 'Fund share')]),
  P('Superstate Fund OS', 'tradfi', [A('CUSHY', 'Coinbase Stablecoin Yield Fund', 'Coinbase Asset Management', DC, 'Solana, Base', 'TradFi manager', 'Fund share')]),
  P('WisdomTree', 'tradfi', [A('CRDYX', 'WisdomTree Private Credit and Alternative Income Digital Fund', 'WisdomTree', DC, 'Stellar, Solana, Plume, Ethereum', 'TradFi manager', 'Fund share'), A('WTSIX', 'WisdomTree Short-Duration Income Digital Fund', 'WisdomTree', DC, 'Stellar, Solana, Plume, Ethereum, Optimism, Base, Avalanche, Arbitrum', 'TradFi manager', 'Fund share')]),

      // Onchain platforms
  P('3jane', 'onchain', [A('USD3', 'USD3', '3jane', SF, 'Ethereum', 'Onchain platform', 'Senior tranche'), A('sUSD3', 'sUSD3', '3jane', SF, 'Ethereum', 'Onchain platform', 'Junior tranche')]),
  P('Accountable', 'onchain', [A('vUSD', 'RWA Backed Lending by Valos', 'Valos', DC, 'Monad', 'Onchain platform', 'Vault')]),
  P('Coinshift', 'onchain', [A('USPC', 'Coinshift USPC', 'Coinshift', DC, '', 'Onchain platform')]),
  P('cSigma Finance', 'onchain', [A('cSUPQPCDC', 'Superior Quality Private Credit USDC', 'cSigma Finance', CC, 'Ethereum', 'Onchain platform', 'Pool token'), A('csUSD', 'cSigma USD', 'cSigma Finance', CC, 'Hedera, Ethereum', 'Onchain platform', 'Pool token'), A('cSUPQPV', 'Superior Quality Private Credit USDT', 'cSigma Finance', CC, 'Ethereum', 'Onchain platform', 'Pool token'), A('cSUPQPCH', 'Superior Quality Private Credit Hedera', 'cSigma Finance', CC, 'Hedera', 'Onchain platform', 'Pool token')]),
  P('Ember', 'onchain', [A('pAlpha', 'Pharos RealFi Ecosystem Vault', 'Axil', DC, 'Pharos', 'Onchain wrapper', 'Vault')]),
  P('Huma', 'onchain', [A('PST', 'PayFi Strategy Token', 'Huma', ABC, 'Solana', 'Onchain platform', 'Pool token')]),
  P('Maple', 'onchain', [A('syrupUSDC', 'Syrup USDC', 'Maple', ABC, 'Multi-chain', 'Onchain platform', 'Vault'), A('syrupUSDT', 'Syrup USDT', 'Maple', ABC, 'Multi-chain', 'Onchain platform', 'Vault'), A('syrupUSDG', 'Syrup USDG', 'Maple', ABC, 'Ethereum, Robinhood', 'Onchain platform', 'Vault')]),
  P('OpenTrade (Perimeter Protocol)', 'onchain', [A('xDLF', 'DeFi Lending FalconX Prime Brokerage', 'Five Sigma', CC, 'Plume', 'Onchain vault', 'Vault'), A('XDFIS', 'OpenTrade Diversified Fixed Income Strategy', 'Five Sigma', DC, 'Avalanche', 'Onchain vault', 'Vault'), A('xUSCLO', 'USDC AAA CLO Vault', 'Five Sigma', DC, 'Avalanche', 'Onchain vault', 'Vault'), A('XUPL', 'USDC PayFi Lending Vault', 'Five Sigma', ABC, 'Avalanche', 'Onchain vault', 'Vault'), A('XUPL-PLUME', 'USDC PayFi Lending Vault (Plume)', 'Five Sigma', ABC, 'Plume', 'Onchain vault', 'Vault'), A('xIGCP', 'Investment Grade Commercial Paper Vault', 'Five Sigma', CC, 'Avalanche', 'Onchain vault', 'Vault'), A('xCRDYX', 'WisdomTree Private Credit & Alternative Income Vault', 'Five Sigma', DC, 'Plume', 'TradFi via vault', 'Vault'), A('xEPCA', 'EURC 90 Day Private Credit', 'Five Sigma', ABC, 'Avalanche', 'Onchain vault', 'Vault'), A('XHYC', 'High Yield Corporate Bond Vault', 'Five Sigma', CC, 'Avalanche', 'Onchain vault', 'Vault'), A('XHYCB', 'High Yield Corporate Bond (Plume)', 'Five Sigma', CC, 'Plume', 'Onchain vault', 'Vault'), A('XDFIS3', 'Diversified Fixed Income 3', 'Five Sigma', DC, 'Avalanche', 'Onchain vault', 'Vault ($0)'), A('xECLO', 'EURC CLO Vault', 'Five Sigma', DC, 'Avalanche', 'Onchain vault', 'Vault ($0)'), A('XDFIS2', 'Diversified Fixed Income 2', 'Five Sigma', DC, 'Avalanche', 'Onchain vault', 'Vault ($0)'), A('XEPL', 'EUROP PayFi Lending Vault', 'Five Sigma', ABC, 'Avalanche', 'Onchain vault', 'Vault ($0)')]),
  P('Pareto', 'onchain', [A('AA_FalconXUSDC', 'FalconX Credit Vault', 'M11 Credit', DC, 'Ethereum, Monad', 'Onchain platform', 'Vault receipt'), A('AA_RockawayUSDC', 'RockawayX Credit Vault', 'Pareto', DC, 'Ethereum', 'Onchain platform', 'Vault receipt'), A('AA_idle_Fasanara', 'Fasanara Digital Credit Vault', 'Fasanara', DC, 'Ethereum', 'TradFi manager', 'Vault receipt'), A('AA_BastionUSDC', 'Bastion Trading Credit Vault', 'Pareto', DC, 'Ethereum', 'Onchain platform', 'Vault receipt'), A('AA_Adaptive FrontierUSDC', 'Adaptive Frontier Credit Vault', 'Pareto', DC, 'Ethereum', 'Onchain platform', 'Vault receipt'), A('ParetoM1C-USDC', 'M1 Capital Credit Vault', 'M1 Capital', DC, 'Ethereum', 'Onchain platform', 'Vault receipt')]),
  P('Plume Vaults', 'onchain', [A('nOPAL', 'Nest BlackOpal LiquidStone II', 'Plume Vaults', ABC, 'Solana, Plume, Ethereum, BNB Chain, Avalanche', 'Onchain vault', 'Vault'), A('nALPHA', 'Nest Alpha Vault', 'Plume Vaults', ABC, 'Solana, Plume', 'Onchain vault', 'Vault'), A('nPERENA', 'Nest Perena Vault', 'Plume Vaults', DC, 'Solana, Plume', 'Onchain vault', 'Vault'), A('nWISDOM', 'Nest WisdomTree Vault', 'Plume Vaults', DC, 'Solana, Plume', 'TradFi via vault', 'Vault'), A('nACRDX', 'Nest Apollo ACRDX Vault', 'Plume Vaults', DC, 'Plume', 'TradFi via vault', 'Vault wrap of ACRDX'), A('nCREDIT', 'Nest Credit Vault', 'Plume Vaults', DC, 'Plume', 'Onchain vault', 'Vault'), A('nINSTO', 'Nest Institutional Vault', 'Plume Vaults', CC, 'Plume', 'Onchain vault', 'Vault'), A('nPAYFI', 'Nest PayFi Vault', 'Plume Vaults', ABC, 'Plume', 'Onchain vault', 'Vault'), A('inALPHA', 'Nest Institutional Alpha', 'Plume Vaults', CC, 'Plume', 'Onchain vault', 'Vault ($0)')]),
  P('Saturn', 'onchain', [A('sUSDat', 'sUSDat', 'Saturn', CC, 'Ethereum, Monad', 'Onchain platform', 'Vault')]),
  P('Stable', 'onchain', [A('mUSDX', 'Staked USDX', 'Stable', ABC, 'Solana', 'Onchain platform', 'Vault')]),
  P('TownSquare', 'onchain', [A('trwaUSD', 'trwaUSDi Proof of Reserve Vault', 'TownSquare', ABC, 'Robinhood, Monad, Ethereum, Base, Arbitrum, Pharos', 'Onchain wrapper', 'Vault')]),

      // Direct originators
  P('Asseto', 'direct', [A('CFSRS', 'Stable Return SP', 'CMS Asset Management', DC, 'Ethereum', 'TradFi manager', 'Fund share'), A('EPOCH+', 'Epoch Stable Credit Notes', 'EpochRWA', CC, 'Ethereum', 'Specialty manager', 'Note')]),
  P('Axil', 'direct', [A('VRPCS', 'Axil Consumer Credit Vault 6M', 'Axil', ABC, 'Pharos', 'Direct originator', 'Vault'), A('VRPCW', 'Axil Consumer Credit Vault 7D', 'Axil', ABC, 'Pharos', 'Direct originator', 'Vault')]),
  P('Bitbond', 'direct', [A('BB1', 'Bitbond BB1 tokenized bond', 'Bitbond', CC, 'Stellar', 'Direct', 'Note')]),
  P('Cashlink', 'direct', [A('LMA1', 'Lemonaid Crowdinvesting', 'Cashlink', CC, 'Polygon', 'Direct', 'Note')]),
  P('Ctrl Alt', 'direct', [A('HERA-I-L', 'Hera I Loan Notes', 'Ctrl Alt', SF, 'Solana', 'Direct', 'Note')]),
  P('GAIB', 'direct', [A('sAID', 'sAID', 'Good AI Management Limited', SF, 'Ethereum', 'Specialty', 'Vault')]),
  P('Galaxy Digital', 'direct', [A('GACLO-1', 'Galaxy CLO 2025-1 Class B', 'Galaxy Digital Capital Management', ABC, 'Avalanche', 'Direct / structured', 'CLO tranche')]),
  P('Hashfire', 'direct', [A('MAPO', 'Mobilization Advance Program One', 'Hashfire', ABC, 'Avalanche', 'Direct originator', 'Receivable')]),
  P('Hastra', 'direct', [A('PRIME', 'PRIME', 'Hastra', ABC, 'Ethereum, Solana', 'Direct originator (Figure)', 'Vault'), A('AUTO', 'AUTO', 'Hastra', ABC, 'Solana', 'Direct originator (Figure)', 'Vault')]),
  P('Lend.xyz', 'direct', [A('opLend-3', 'Lend Operation - Conflans - Residential Redevelopment', 'Lend.xyz', ABC, 'Ethereum', 'Direct originator', 'Note'), A('opLend-1', 'Lend Operation - Conflans - Residential Redevelopment', 'Lend.xyz', ABC, 'Ethereum', 'Direct originator', 'Note'), A('opLend-2', 'Lend Operation - Vouziers - Commercial Units', 'Lend.xyz', ABC, 'Ethereum', 'Direct originator', 'Note')]),
  P('Liqvid', 'direct', [A('LIQVID1037_S', 'TermMax Fixed Income LP Deal', 'Liqvid', ABC, 'Stellar', 'Direct', 'Note'), A('LIQVID1041_S', 'Zynk TVL Provision Deal', 'Liqvid', SF, 'Stellar', 'Direct', 'Note')]),
  P('NUVA', 'direct', [A('nvPRIME', 'NUVA nvPRIME', 'NUVA', ABC, 'Ethereum', 'Direct (Figure book)', 'Vault wrap of PRIME'), A('nvYLDS', 'NUVA nvYLDS', 'NUVA', ABC, 'Ethereum', 'Direct', 'Vault wrap')]),
  P('Obligate', 'direct', [A('oTFY', 'Obligate Trade Finance Yield', 'Obligate', ABC, 'Solana', 'Direct', 'Note')]),
  P('OnRe', 'direct', [A('ONyc', 'OnRe Tokenized Reinsurance', 'OnRe', SF, 'Solana', 'Direct / specialty', 'Fund token')]),
  P('R25', 'direct', [A('VRPCQ', 'Axil Consumer Credit Vault 3M', 'R25', ABC, 'Pharos', 'Direct originator', 'Vault'), A('APC3M', 'R25 Axil Prime Credit 3M', 'Axil', ABC, 'Pharos', 'Direct originator', 'Vault')]),
  P('Re', 'direct', [A('reUSD', 'reUSD', 'Re', SF, 'Solana, Monad, Ethereum, Base, Avalanche, Arbitrum', 'Direct / specialty', 'Reinsurance token'), A('reUSDe', 'reUSDe', 'Re', SF, 'Ethereum', 'Direct / specialty', 'Reinsurance token')]),
  P('Republic', 'direct', [A('NOTE', 'Republic NOTE', 'Republic', SF, 'Avalanche', 'Specialty', 'Note')]),
  P('Rivool Finance', 'direct', [A('RVL4', 'Rivool Agriculture Notes High Yield', 'Nagro', ABC, 'Stellar', 'Direct originator', 'Note'), A('RVL5', 'Rivool Agriculture Notes High Grade', 'Rivool Finance', ABC, 'Stellar', 'Direct originator', 'Note'), A('RVL2', 'Rivool Institucional Nagro Agro', 'Nagro', ABC, 'Stellar', 'Direct originator', 'Note'), A('RVL1', 'Rivool Institucional Nagro Agro', 'Nagro', ABC, 'Stellar', 'Direct originator', 'Note')]),
  P('STOKR', 'direct', [A('BMN2', 'Blockstream Mining Note 2', 'SICOS Securities', SF, 'Liquid Network', 'Direct / specialty', 'Note'), A('PKH2', 'PKH Mining Note 2', 'STOKR', SF, 'Liquid Network', 'Direct / specialty', 'Note'), A('AQF', 'Aquarius High Yield Debt Fund', 'SICOS Securities', CC, 'Liquid Network', 'TradFi manager', 'Fund share'), A('STRCst', 'STRC Note', 'STOKR', CC, 'Liquid Network', 'Direct', 'Note')]),
  P('VERT Capital', 'direct', [A('BRVERTCRA4T3', 'VERT\'s 101th CRA - 2nd Tranche', 'VERT Capital', CC, 'XRPL', 'Direct / local', 'Tranche'), A('BRVERTCRA4V9', 'VERT\'s 101th CRA - 4th Tranche', 'VERT Capital', CC, 'XRPL', 'Direct / local', 'Tranche'), A('BRVERTCRA4S5', 'VERT\'s 101th CRA - 1st Tranche', 'VERT Capital', CC, 'XRPL', 'Direct / local', 'Tranche'), A('BRVERTCRA4U1', 'VERT\'s 101th CRA - 3rd Tranche', 'VERT Capital', CC, 'XRPL', 'Direct / local', 'Tranche')]),
];

/** Which DeFi activities each ticker has. Placeholder until every integration is verified. */
export const USES: Record<string, string[]> = {
      'ACRED': ['Borrow', 'Vault', 'Loop'], 'syrupUSDC': ['Borrow', 'Vault', 'Yield', 'Loop'], 'syrupUSDT': ['Yield'],
      'mF-ONE': ['Borrow', 'Loop'], 'JAAA': ['Borrow', 'Vault'], 'HLSCOPE': ['Borrow'], 'PST': ['Borrow', 'Yield'],
      'USD3': ['Vault', 'Yield'], 'reUSD': ['Yield'], 'ONyc': ['Yield'], 'PRIME': ['Borrow']
    };

export const ALL_ASSETS: { asset: Asset; platform: Platform }[] = PLATFORMS.flatMap((p) =>
  p.assets.map((asset) => ({ asset, platform: p })),
);

export const findPlatform = (name: string | null): Platform | null =>
  name ? PLATFORMS.find((p) => p.name === name) ?? null : null;

export const defiLabel = (ticker: string): string => {
  const u = USES[ticker];
  return u ? `${u.join(' · ')} →` : 'Not in DeFi yet';
};
