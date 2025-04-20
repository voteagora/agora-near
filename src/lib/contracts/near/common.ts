export type AccountId = string;

// ----- Shared value types -----
export interface Fraction {
  numerator: string;
  denominator: string;
}

export interface VenearBalance {
  extra_venear_balance: string;
  near_balance: string;
}

// ----- Core record types -----
export interface Account {
  account_id: AccountId;
  balance: VenearBalance;
  delegated_balance: VenearBalance;
  delegation: AccountDelegation | null;
  update_timestamp: string;
}

export interface AccountDelegation {
  account_id: AccountId;
}

export interface AccountInternal {
  deposit: string;
  lockup_update_nonce: string;
  lockup_version: number | null;
}

export interface AccountInfo {
  account: Account;
  internal: AccountInternal;
}

export interface MerkleProof {
  index: number;
  path: string[];
}

export interface MerkleTreeSnapshot {
  block_height: number;
  length: number;
  root: string;
}

export interface ContractMethodRequirements {
  gas?: string; // Optional gas amount in TGas (10^12)
  deposit?: string; // Optional deposit amount in yoctoNEAR
}

export type MethodRequirementsConfig<T> = {
  [K in keyof T]: {
    gas?: string; // Gas amount in TGas (10^12)
    deposit?: string; // Deposit amount in yoctoNEAR
  };
};
