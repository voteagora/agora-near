import { MethodRequirementsConfig } from "./common";
import { VenearWriteContractMethods } from "./venearTypes";

export const venearMethodRequirements: MethodRequirementsConfig<VenearWriteContractMethods> =
  {
    delegate_all: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    deploy_lockup: {
      deposit: undefined, // Requires dynamic deposit amount,
      gas: "100 Tgas",
    },
    ft_transfer: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    ft_transfer_call: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    migrate_state: {},
    new: {},
    on_lockup_deployed: {},
    on_lockup_update: {},
    set_local_deposit: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_lockup_code_deployers: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_lockup_contract: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_owner_account_id: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_staking_pool_whitelist_account_id: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_unlock_duration_sec: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    storage_deposit: {
      deposit: undefined, // Requires dynamic deposit amount
    },
    storage_withdraw: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    undelegate: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
  };
