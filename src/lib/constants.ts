import { NEAR_NOMINATION_EXP } from "near-api-js/lib/utils/format";
import { TenantToken, TokenMetadata } from "./types";
import nearAssetIcon from "@/assets/icons/near_icon.jpg";
import linearAssetIcon from "@/assets/icons/linear.svg";
import stnearAssetIcon from "@/assets/icons/stnear.svg";
import veNearAssetIcon from "@/assets/icons/venear.svg";

export const INDEXER_DELAY = 3000;

export const SECONDS_IN_HOUR = 3600;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export enum FREQUENCY_FILTERS {
  DAY = "24h",
  WEEK = "7d",
  MONTH = "1m",
  QUARTER = "3m",
  YEAR = "1y",
}

export enum PROPOSAL_STATUS {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  CLOSED = "CLOSED",
  DEFEATED = "DEFEATED",
  EXECUTED = "EXECUTED",
  PENDING = "PENDING",
  QUEUED = "QUEUED",
  SUCCEEDED = "SUCCEEDED",
}

export enum DELEGATION_MODEL {
  FULL = "FULL",
  ADVANCED = "ADVANCED",
  PARTIAL = "PARTIAL",
}

export const TENANT_NAMESPACES = {
  ENS: "ens",
  ETHERFI: "etherfi",
  OPTIMISM: "optimism",
  NEAR: "near",
  UNISWAP: "uniswap",
  CYBER: "cyber",
  SCROLL: "scroll",
  DERIVE: "derive",
  PGUILD: "pguild",
  BOOST: "boost",
  XAI: "xai",
  B3: "b3",
  DEMO: "demo",
} as const;

export const proposalsFilterOptions = {
  relevant: {
    value: "Relevant",
    filter: "relevant",
  },
  everything: {
    value: "Everything",
    filter: "everything",
  },
};
export const delegatesFilterOptions = {
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

export const citizensFilterOptions = {
  mostVotingPower: {
    value: "Most voting power",
    sort: "most_voting_power",
  },
  shuffle: {
    sort: "shuffle",
    value: "Shuffle",
  },
};
export const delegatesVotesSortOptions = {
  newest: {
    sortOrder: "desc",
    value: "Newest",
  },
  oldest: {
    sortOrder: "asc",
    value: "Oldest",
  },
};

export const retroPGFCategories = {
  ALL: {
    filter: "All projects",
  },
  COLLECTIVE_GOVERNANCE: {
    text: "Collective Governance",
    filter: "Collective Governance (104)",
  },
  DEVELOPER_ECOSYSTEM: {
    text: "Developer Ecosystem",
    filter: "Developer Ecosystem (304)",
  },
  END_USER_EXPERIENCE_AND_ADOPTION: {
    text: "End UX & Adoption",
    filter: "End User Experience & Adoption (472)",
  },
  OP_STACK: {
    text: "OP Stack",
    filter: "OP Stack (165)",
  },
};

export const retroPGFSort = {
  mostAwarded: "by most RPGF received",
  alphabeticalAZ: "Alphabetical (A-Z)",
  alphabeticalZA: "Alphabetical (Z-A)",
  shuffle: "Shuffle",
  byIncludedInBallots: "Least in ballots",
  mostInBallots: "Most in ballots",
};

export const disapprovalThreshold = 12;

export enum GOVERNOR_TYPE {
  AGORA = "AGORA",
  ALLIGATOR = "ALLIGATOR",
  BRAVO = "BRAVO",
  ENS = "ENS",
}

export enum TIMELOCK_TYPE {
  TIMELOCK_NO_ACCESS_CONTROL = "TIMELOCK_NO_ACCESS_CONTROL",
  TIMELOCKCONTROLLER_WITH_ACCESS_CONTROL = "TIMELOCKCONTROLLER_WITH_ACCESS_CONTROL",
  TIMELOCKCONTROLLER_WITH_ACCESS_CONTROL_ERC721_ERC115 = "TIMELOCKCONTROLLER_WITH_ACCESS_CONTROL_ERC721_ERC115",
}

export const NEAR_VOTING_OPTIONS = ["For", "Against"];

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
