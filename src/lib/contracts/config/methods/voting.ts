import { MethodConfig } from "../../types/common";
import { VotingWriteContractMethods } from "../../types/voting";

export const votingMethodConfig: MethodConfig<VotingWriteContractMethods> = {
  approve_proposal: {
    deposit: "1",
  },
  create_proposal: {
    gas: "100 Tgas",
    deposit: "0.2",
  },
  migrate_state: {},
  new: {},
  on_get_snapshot: {},
  reject_proposal: {
    deposit: "1",
  },
  set_base_proposal_fee: {
    deposit: "1",
  },
  set_max_number_of_voting_options: {
    deposit: "1",
  },
  set_owner_account_id: {
    deposit: "1",
  },
  set_reviewer_ids: {
    deposit: "1",
  },
  set_venear_account_id: {
    deposit: "1",
  },
  set_vote_storage_fee: {
    deposit: "1",
  },
  set_voting_duration: {
    deposit: "1",
  },
  vote: {
    gas: "100 Tgas",
  },
};
