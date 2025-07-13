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
  votingStartTimeNs?: string | null;
  votingCreatedAtNs?: string | null;
};

export type ProposalNonVotersRecord = {
  id: string;
  proposalId: number;
  registeredVoterId: string;
};
