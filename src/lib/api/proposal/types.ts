export type ProposalVotingHistoryRecord = {
  accountId: string;
  votingPower: string;
  voteOption: string;
  votedAt: number;
};

export type Proposal = {
  id: string;
  approvedAt?: string | null;
  approverId: string | null;
  createdAt?: string | null;
  creatorId: string;
  hasVote: boolean;
  isApproved: boolean;
  isRejected: boolean;
  proposalDescription: string;
  proposalId: number;
  proposalTitle: string;
  proposalUrl: string;
  receiptId: string;
  rejectedAt: Date | null;
  rejecterId: string | null;
  forVotingPower: string;
  againstVotingPower: string;
  abstainVotingPower: string;
  votingDurationNs?: string | null;
  totalVotingPower?: string | null;
  status?: string | null; // 'Created' | 'Voting' | 'Finished' | 'Rejected'
  proposalType?: string; // e.g. 'SimpleMajority' | 'SuperMajority'
  votingStartTimeNs?: string | null;
  votingCreatedAtNs?: string | null;
  quorumAmountYoctoNear?: string | null;
  quorumAmount?: string | null;
};

export type ProposalNonVotersRecord = {
  id: string;
  proposalId: number;
  registeredVoterId: string;
  votingPower: string;
};

export enum DraftProposalStage {
  DRAFT = "DRAFT",
  AWAITING_SUBMISSION = "AWAITING_SUBMISSION",
  SUBMITTED = "SUBMITTED",
}

export type DraftProposal = {
  id: string;
  title: string;
  description: string;
  proposalUrl?: string;
  author: string;
  stage: DraftProposalStage;
  votingOptions?: { options: string[] };
  receiptId?: string | null;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDraftProposalRequest = {
  author: string;
};

export type UpdateDraftProposalRequest = {
  title?: string;
  description?: string;
  proposalUrl?: string;
  stage?: DraftProposalStage;
  receiptId?: string;
  votingOptions?: { options: string[] };
};

export type UpdateDraftProposalStageRequest = {
  stage: DraftProposalStage;
  receiptId?: string;
};

export type GetDraftProposalsResponse = {
  draftProposals: DraftProposal[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type GetProposalQuorumResponse = {
  quorumAmount: string;
};
