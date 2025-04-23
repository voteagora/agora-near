import { AccountId } from "./common";

export interface LockupReadContractMethods {
  /** no params, JSON RPC returns whatever the contract embeds (usually none) */
  contract_source_metadata: {
    args: Record<never, never>;
    result: unknown;
  };

  get_balance: {
    args: Record<never, never>;
    result: string;
  };
  get_known_deposited_balance: {
    args: Record<never, never>;
    result: string;
  };
  get_liquid_owners_balance: {
    args: Record<never, never>;
    result: string;
  };
  get_lockup_update_nonce: {
    args: Record<never, never>;
    result: string;
  };
  get_owner_account_id: {
    args: Record<never, never>;
    result: AccountId;
  };
  get_owners_balance: {
    args: Record<never, never>;
    result: string;
  };
  get_staking_pool_account_id: {
    args: Record<never, never>;
    result: AccountId | null;
  };
  get_venear_liquid_balance: {
    args: Record<never, never>;
    result: string;
  };
  get_venear_locked_balance: {
    args: Record<never, never>;
    result: string;
  };
  get_venear_pending_balance: {
    args: Record<never, never>;
    result: string;
  };
  get_venear_unlock_timestamp: {
    args: Record<never, never>;
    result: string;
  };
  get_version: {
    args: Record<never, never>;
    result: number;
  };
}

export interface LockupWriteContractMethods {
  begin_unlock_near: {
    args: { amount: string | null };
    result: unknown;
  };
  delete_lockup: {
    args: Record<never, never>;
    result: unknown;
  };
  deposit_and_stake: {
    args: { amount: string };
    result: unknown;
  };
  deposit_to_staking_pool: {
    args: { amount: string };
    result: unknown;
  };
  end_unlock_near: {
    args: { amount: string | null };
    result: unknown;
  };
  lock_near: {
    args: { amount: string | null };
    result: unknown;
  };
  lock_pending_near: {
    args: { amount: string | null };
    result: unknown;
  };
  new: {
    args: {
      owner_account_id: AccountId;
      venear_account_id: AccountId;
      unlock_duration_ns: string;
      staking_pool_whitelist_account_id: AccountId;
      version: number;
      lockup_update_nonce: string;
      min_lockup_deposit: string;
    };
    result: unknown;
  };
  on_get_account_total_balance: {
    args: Record<never, never>;
    result: unknown;
  };
  on_get_account_unstaked_balance_to_withdraw_by_owner: {
    args: Record<never, never>;
    result: unknown;
  };
  on_staking_pool_deposit: {
    args: { amount: string };
    result: boolean;
  };
  on_staking_pool_deposit_and_stake: {
    args: { amount: string };
    result: boolean;
  };
  on_staking_pool_stake: {
    args: { amount: string };
    result: boolean;
  };
  on_staking_pool_unstake: {
    args: { amount: string };
    result: boolean;
  };
  on_staking_pool_unstake_all: {
    args: Record<never, never>;
    result: boolean;
  };
  on_staking_pool_withdraw: {
    args: { amount: string };
    result: boolean;
  };
  on_whitelist_is_whitelisted: {
    args: { staking_pool_account_id: AccountId };
    result: boolean;
  };
  refresh_staking_pool_balance: {
    args: Record<never, never>;
    result: unknown;
  };
  select_staking_pool: {
    args: { staking_pool_account_id: AccountId };
    result: unknown;
  };
  stake: {
    args: { amount: string };
    result: unknown;
  };
  transfer: {
    args: { amount: string; receiver_id: AccountId };
    result: unknown;
  };
  unselect_staking_pool: {
    args: Record<never, never>;
    result: unknown;
  };
  unstake: {
    args: { amount: string };
    result: unknown;
  };
  unstake_all: {
    args: Record<never, never>;
    result: unknown;
  };
  withdraw_all_from_staking_pool: {
    args: Record<never, never>;
    result: unknown;
  };
  withdraw_from_staking_pool: {
    args: { amount: string };
    result: unknown;
  };
}
