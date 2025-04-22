import { MethodRequirementsConfig } from "./common";
import { VotingWriteContractMethods } from "./votingTypes";

export const votingMethodRequirements: MethodRequirementsConfig<VotingWriteContractMethods> =
  {
    approve_proposal: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    create_proposal: {
      gas: "100 Tgas",
      deposit: "0.2", // Requires dynamic deposit amount
    },
    migrate_state: {},
    new: {},
    on_get_snapshot: {},
    reject_proposal: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_base_proposal_fee: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_max_number_of_voting_options: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_owner_account_id: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_reviewer_ids: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_venear_account_id: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_vote_storage_fee: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    set_voting_duration: {
      deposit: "1", // Requires exactly 1 yoctoNEAR
    },
    vote: {
      gas: "100 Tgas",
    },
  };
