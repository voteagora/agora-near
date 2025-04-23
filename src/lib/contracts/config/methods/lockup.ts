import { MethodConfig } from "../../types/common";
import { LockupWriteContractMethods } from "../../types/lockup";

export const lockupMethodConfig: MethodConfig<LockupWriteContractMethods> = {
  begin_unlock_near: {
    deposit: "1",
  },
  delete_lockup: {
    deposit: "1",
  },
  deposit_and_stake: {
    gas: "125 Tgas",
    deposit: "1",
  },
  deposit_to_staking_pool: {
    gas: "100 Tgas",
    deposit: "1",
  },
  end_unlock_near: {
    deposit: "1",
  },
  lock_near: {
    deposit: "1",
  },
  lock_pending_near: {
    deposit: "1",
  },
  new: {
    gas: "25 Tgas",
  },
  on_get_account_total_balance: {},
  on_get_account_unstaked_balance_to_withdraw_by_owner: {},
  on_staking_pool_deposit: {},
  on_staking_pool_deposit_and_stake: {},
  on_staking_pool_stake: {},
  on_staking_pool_unstake: {},
  on_staking_pool_unstake_all: {},
  on_staking_pool_withdraw: {},
  on_whitelist_is_whitelisted: {},
  refresh_staking_pool_balance: {
    deposit: "1",
    gas: "75 Tgas",
  },
  select_staking_pool: {
    deposit: "1",
    gas: "75 Tgas",
  },
  stake: {
    deposit: "1",
    gas: "125 Tgas",
  },
  transfer: {
    deposit: "1",
    gas: "50 Tgas",
  },
  unselect_staking_pool: {
    deposit: "1",
    gas: "25 Tgas",
  },
  unstake: {
    deposit: "1",
    gas: "125 Tgas",
  },
  unstake_all: {
    deposit: "1",
    gas: "125 Tgas",
  },
  withdraw_all_from_staking_pool: {
    deposit: "1",
    gas: "175 Tgas",
  },
  withdraw_from_staking_pool: {
    gas: "125 Tgas",
    deposit: "1",
  },
};
