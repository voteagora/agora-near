import { MerkleProof } from "./common";
import { VAccount } from "./venear";

// some shared types
export type AccountId = string;
export interface MerkleTreeSnapshot {
  block_height: number;
  length: number;
  root: string;
}

/** ProposalMetadata as on-chain; you can expand this if you need to decode it client‑side */
export interface ProposalMetadata {
  description: string | null;
  link: string | null;
  title: string | null;
  voting_options: string[];
}

/** Full on‑chain proposal info */

export enum ProposalStatus {
  Created = "Created",
  Rejected = "Rejected",
  Approved = "Approved",
  Voting = "Voting",
  Finished = "Finished",
}

export enum ProposalDisplayStatus {
  Active = "Active",
  Defeated = "Defeated",
  Succeeded = "Succeeded",
}

export type VoterStats = { total_venear: string; total_votes: number };

export interface ProposalInfo {
  id: number;
  proposer_id: AccountId;
  creation_time_ns: string;
  description: string | null;
  link: string | null;
  title: string | null;
  rejected: boolean;
  reviewer_id: AccountId | null;
  status: ProposalStatus;
  total_votes: VoterStats;
  votes: Array<VoterStats>;
  voting_duration_ns: string;
  voting_options: string[];
  voting_start_time_ns: string | null;
  snapshot_and_state?: {
    snapshot: MerkleTreeSnapshot;
    timestamp_ns: string;
    total_venear: string;
    venear_growth_config: any;
  } | null;
  quorumAmountYoctoNear?: string;
  proposalType?: string;
  approvalThreshold?: string;
}

/** Contract config object returned by get_config */
export interface VotingConfig {
  base_proposal_fee: string;
  max_number_of_voting_options: number;
  owner_account_id: AccountId;
  reviewer_ids: AccountId[];
  venear_account_id: AccountId;
  vote_storage_fee: string;
  voting_duration_ns: string;
}

export interface VotingReadContractMethods {
  contract_source_metadata: {
    args: Record<never, never>;
    result: unknown;
  };

  get_approved_proposals: {
    args: { from_index: number; limit: number | null };
    result: ProposalInfo[];
  };
  get_config: {
    args: Record<never, never>;
    result: VotingConfig;
  };
  get_num_approved_proposals: {
    args: Record<never, never>;
    result: number;
  };
  get_num_proposals: {
    args: Record<never, never>;
    result: number;
  };
  get_proposal: {
    args: { proposal_id: number };
    result: ProposalInfo | null;
  };
  get_proposals: {
    args: { from_index: number; limit: number | null };
    result: ProposalInfo[];
  };
  get_version: {
    args: Record<never, never>;
    result: string;
  };
  get_vote: {
    args: { account_id: AccountId; proposal_id: number };
    result: number | null;
  };
}

export interface VotingWriteContractMethods {
  approve_proposal: {
    args: {
      proposal_id: number;
      voting_start_time_sec: number | null;
    };
    result: unknown;
  };
  create_proposal: {
    args: { metadata: ProposalMetadata };
    result: number;
  };
  migrate_state: {
    args: Record<never, never>;
    result: unknown;
  };
  new: {
    args: { config: VotingConfig };
    result: unknown;
  };
  on_get_snapshot: {
    args: {
      reviewer_id: AccountId;
      proposal_id: number;
      voting_start_time_sec: number | null;
    };
    result: ProposalInfo;
  };
  reject_proposal: {
    args: { proposal_id: number };
    result: unknown;
  };
  set_base_proposal_fee: {
    args: { base_proposal_fee: string };
    result: unknown;
  };
  set_max_number_of_voting_options: {
    args: { max_number_of_voting_options: number };
    result: unknown;
  };
  set_owner_account_id: {
    args: { owner_account_id: AccountId };
    result: unknown;
  };
  set_reviewer_ids: {
    args: { reviewer_ids: AccountId[] };
    result: unknown;
  };
  set_venear_account_id: {
    args: { venear_account_id: AccountId };
    result: unknown;
  };
  set_vote_storage_fee: {
    args: { _vote_storage_fee: string };
    result: unknown;
  };
  set_voting_duration: {
    args: { voting_duration_sec: number };
    result: unknown;
  };
  vote: {
    args: {
      proposal_id: number;
      vote: number;
      merkle_proof: MerkleProof;
      v_account: VAccount;
    };
    result: unknown;
  };
}
