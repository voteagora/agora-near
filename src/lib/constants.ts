import { NEAR_NOMINATION_EXP } from "near-api-js/lib/utils/format";
import { StakingPool, TenantToken, TokenMetadata } from "./types";
import nearAssetIcon from "@/assets/near_icon.jpg";
import linearAssetIcon from "@/assets/linear.svg";
import stnearAssetIcon from "@/assets/stnear.svg";
import veNearAssetIcon from "@/assets/venear.svg";

export const SECONDS_IN_HOUR = 3600;

export const TENANT_NAMESPACES = {
  NEAR: "near",
} as const;

export const delegatesSortOptions = {
  weightedRandom: {
    sort: "weighted_random",
    value: "Random (default)",
  },
  mostVotingPower: {
    sort: "most_voting_power",
    value: "Most voting power",
  },
  mostDelegators: {
    sort: "least_voting_power",
    value: "Least voting power",
  },
};

export const delegatesFilterOptions = {
  all: {
    value: "All (default)",
    filter: "all",
  },
  endorsed: {
    value: "Endorsed",
    filter: "endorsed",
  },
};

export const NEAR_VOTING_OPTIONS = ["For", "Against", "Abstain"];

export const NEAR_TOKEN: TenantToken = {
  name: "NEAR Protocol",
  symbol: "NEAR",
  decimals: NEAR_NOMINATION_EXP,
};

export const VOTING_THRESHOLDS = {
  SIMPLE_MAJORITY: 51,
  SUPER_MAJORITY: 75,
};

export const CACHE_TTL = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 60, // 1 hour
  LONG: 1000 * 60 * 60 * 24, // 24 hours
};

export const NANO_SECONDS_IN_DAY = 1000000000 * 60 * 60 * 24;
export const NANO_SECONDS_IN_YEAR = 365 * NANO_SECONDS_IN_DAY;

export const LINEAR_TOKEN_CONTRACTS = {
  testnet: "linear-protocol.testnet",
  mainnet: "linear-protocol.near",
};

export const STNEAR_TOKEN_CONTRACTS = {
  testnet: "meta-v2.pool.testnet",
  mainnet: "meta-pool.near",
};

export const NEAR_TOKEN_METADATA: TokenMetadata = {
  name: "NEAR",
  symbol: "NEAR",
  decimals: NEAR_NOMINATION_EXP,
  icon: nearAssetIcon,
};

export const LINEAR_TOKEN_METADATA: TokenMetadata = {
  name: "LiNEAR",
  symbol: "LINEAR",
  decimals: NEAR_NOMINATION_EXP,
  icon: linearAssetIcon,
};

export const STNEAR_TOKEN_METADATA: TokenMetadata = {
  name: "Staked NEAR",
  symbol: "STNEAR",
  decimals: NEAR_NOMINATION_EXP,
  icon: stnearAssetIcon,
};

export const VENEAR_TOKEN_METADATA: TokenMetadata = {
  name: "veNEAR",
  symbol: "VENEAR",
  decimals: NEAR_NOMINATION_EXP,
  icon: veNearAssetIcon,
};

export const DEFAULT_GAS_RESERVE = "200000000000000000000000"; // 0.2 NEAR

export const LINEAR_POOL: StakingPool = {
  id: "linear",
  contracts: {
    testnet: LINEAR_TOKEN_CONTRACTS.testnet,
    mainnet: LINEAR_TOKEN_CONTRACTS.mainnet,
  },
  metadata: LINEAR_TOKEN_METADATA,
};

export const STNEAR_POOL: StakingPool = {
  id: "stnear",
  contracts: {
    testnet: STNEAR_TOKEN_CONTRACTS.testnet,
    mainnet: STNEAR_TOKEN_CONTRACTS.mainnet,
  },
  priceMethod: "get_st_near_price",
  metadata: STNEAR_TOKEN_METADATA,
};
