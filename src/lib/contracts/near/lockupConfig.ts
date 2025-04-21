import { MethodRequirementsConfig } from "./common";
import { LockupWriteContractMethods } from "./lockupTypes";

export const lockupMethodRequirements: MethodRequirementsConfig<LockupWriteContractMethods> =
  {
    begin_unlock_near: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    delete_lockup: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    deposit_and_stake: {
      gas: "125 Tgas", // Requires 125 TGas (5 * BASE_GAS)
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    deposit_to_staking_pool: {
      gas: "100 Tgas", // Requires 100 TGas (4 * BASE_GAS)
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    end_unlock_near: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    lock_near: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    lock_pending_near: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    new: {
      gas: "25 Tgas", // Requires 25 TGas (1 * BASE_GAS)
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
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "75 Tgas", // Requires 75 TGas (3 * BASE_GAS)
    },
    select_staking_pool: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "75 Tgas", // Requires 75 TGas (3 * BASE_GAS)
    },
    stake: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "125 Tgas", // Requires 125 TGas (5 * BASE_GAS)
    },
    transfer: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "50 Tgas", // Requires 50 TGas (2 * BASE_GAS)
    },
    unselect_staking_pool: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "25 Tgas", // Requires 25 TGas (1 * BASE_GAS)
    },
    unstake: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "125 Tgas", // Requires 125 TGas (5 * BASE_GAS)
    },
    unstake_all: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "125 Tgas", // Requires 125 TGas (5 * BASE_GAS)
    },
    withdraw_all_from_staking_pool: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
      gas: "175 Tgas", // Requires 175 TGas (7 * BASE_GAS)
    },
    withdraw_from_staking_pool: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
  };
