import { MethodConfig } from "../../types/common";
import { VenearWriteContractMethods } from "../../types/venear";

export const venearMethodConfig: MethodConfig<VenearWriteContractMethods> = {
  delegate_all: {
    deposit: "1",
  },
  deploy_lockup: {
    deposit: undefined,
    gas: "100 Tgas",
  },
  ft_transfer: {
    deposit: "1",
  },
  ft_transfer_call: {
    deposit: "1",
  },
  migrate_state: {},
  new: {},
  on_lockup_deployed: {},
  on_lockup_update: {},
  set_local_deposit: {
    deposit: "1",
  },
  set_lockup_code_deployers: {
    deposit: "1",
  },
  set_lockup_contract: {
    deposit: "1",
  },
  set_owner_account_id: {
    deposit: "1",
  },
  set_staking_pool_whitelist_account_id: {
    deposit: "1",
  },
  set_unlock_duration_sec: {
    deposit: "1",
  },
  storage_deposit: {
    deposit: undefined,
  },
  storage_withdraw: {
    deposit: "1",
  },
  undelegate: {
    deposit: "1",
  },
};
