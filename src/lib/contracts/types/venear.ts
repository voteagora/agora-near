import {
  Account,
  AccountId,
  AccountInfo,
  Fraction,
  MerkleProof,
  MerkleTreeSnapshot,
  VenearBalance,
} from "./common";

export interface LockupUpdateV1 {
  locked_near_balance: string;
  lockup_update_nonce: string;
  timestamp: string;
}
export type VLockupUpdate = { V1: LockupUpdateV1 };

export interface GlobalState {
  total_venear_balance: VenearBalance;
  update_timestamp: string;
  venear_growth_config: VenearGrowthConfig;
}

export interface VenearGrowthConfigFixedRate {
  annual_growth_rate_ns: Fraction;
}

export type VenearGrowthConfig = {
  FixedRate: VenearGrowthConfigFixedRate;
};

export interface VAccount {
  V0: Account;
}

export interface VGlobalState {
  V0: GlobalState;
}

// ----- Storage types -----
export interface StorageBalance {
  available: string;
  total: string;
}

export interface StorageBalanceBounds {
  min: string;
  max?: string | null;
}

// ----- Fungible‑token metadata -----
export interface FtMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon?: string;
  reference?: string;
  reference_hash?: string;
  decimals: number;
}

// ----- Contract config -----
export interface LockupContractConfig {
  contract_hash: string;
  contract_size: number;
  contract_version: number;
}

export interface Config {
  local_deposit: string;
  lockup_code_deployers: AccountId[];
  lockup_contract_config: LockupContractConfig | null;
  min_lockup_deposit: string;
  owner_account_id: AccountId;
  staking_pool_whitelist_account_id: AccountId;
  unlock_duration_ns: string;
}

// ----- Method map -----
export interface VenearReadContractMethods {
  contract_source_metadata: {
    args: Record<never, never>;
    result: unknown;
  };
  ft_balance_of: {
    args: { account_id: AccountId };
    result: string;
  };
  ft_metadata: {
    args: Record<never, never>;
    result: FtMetadata;
  };
  ft_total_supply: {
    args: Record<never, never>;
    result: string;
  };
  get_account_by_index: {
    args: { index: number };
    result: AccountInfo | null;
  };
  get_account_info: {
    args: { account_id: AccountId };
    result: AccountInfo | null;
  };
  get_accounts: {
    args: { from_index: number | null; limit: number | null };
    result: AccountInfo[];
  };
  get_accounts_raw: {
    args: { from_index: number | null; limit: number | null };
    result: VAccount[];
  };
  get_config: {
    args: Record<never, never>;
    result: Config;
  };
  get_lockup_account_id: {
    args: { account_id: AccountId };
    result: AccountId;
  };
  get_lockup_deployment_cost: {
    args: Record<never, never>;
    result: string;
  };
  get_num_accounts: {
    args: Record<never, never>;
    result: number;
  };
  get_proof: {
    args: { account_id: AccountId };
    result: [MerkleProof, VAccount];
  };
  get_snapshot: {
    args: Record<never, never>;
    result: [MerkleTreeSnapshot, VGlobalState];
  };
  get_version: {
    args: Record<never, never>;
    result: string;
  };
  storage_balance_bounds: {
    args: Record<never, never>;
    result: StorageBalanceBounds;
  };
  storage_balance_of: {
    args: { account_id: AccountId };
    result: StorageBalance | null;
  };
}

export interface VenearWriteContractMethods {
  delegate_all: {
    args: { receiver_id: AccountId };
    result: unknown;
  };
  deploy_lockup: {
    args: Record<never, never>;
    result: unknown;
  };
  ft_transfer: {
    args: Record<never, never>;
    result: unknown;
  };
  ft_transfer_call: {
    args: Record<never, never>;
    result: unknown;
  };
  migrate_state: {
    args: Record<never, never>;
    result: unknown;
  };
  new: {
    args: {
      config: Config;
      venear_growth_config: VenearGrowthConfigFixedRate;
    };
    result: unknown;
  };
  on_lockup_deployed: {
    args: {
      version: number;
      account_id: AccountId;
      lockup_update_nonce: string;
      lockup_deposit: string;
    };
    result: AccountId | null;
  };
  on_lockup_update: {
    args: {
      version: number;
      owner_account_id: AccountId;
      update: VLockupUpdate;
    };
    result: unknown;
  };
  set_local_deposit: {
    args: { local_deposit: string };
    result: unknown;
  };
  set_lockup_code_deployers: {
    args: { lockup_code_deployers: AccountId[] };
    result: unknown;
  };
  set_lockup_contract: {
    args: { contract_hash: string; min_lockup_deposit: string };
    result: unknown;
  };
  set_owner_account_id: {
    args: { owner_account_id: AccountId };
    result: unknown;
  };
  set_staking_pool_whitelist_account_id: {
    args: { staking_pool_whitelist_account_id: AccountId };
    result: unknown;
  };
  set_unlock_duration_sec: {
    args: { unlock_duration_sec: number };
    result: unknown;
  };
  storage_deposit: {
    args: { account_id: AccountId | null };
    result: StorageBalance;
  };
  storage_withdraw: {
    args: Record<never, never>;
    result: unknown;
  };
  undelegate: {
    args: Record<never, never>;
    result: unknown;
  };
}
