// Aave Horizon — separate deployment on the Aave stack (marketName proto_horizon_v3).
// AaveKit / GraphQL returns full reserve objects with token metadata.
// Stub: wire AaveKit's client here, or hit the Horizon subgraph directly.
import type { RawMarket } from './types';

export async function fetchAaveHorizon(): Promise<RawMarket[]> {
  // TODO: import { AaveClient } from '@aave/client' and query Horizon reserves.
  // Return [] until wired so the pipeline runs end-to-end without it.
  return [];
}
