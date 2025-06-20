export type ProposalVotingHistoryRecord = {
  accountId: string;
  votingPower: string;
  voteOption: string;
  votedAt: number;
};

export type Proposal = {
  id: string;
  approvedAt: Date | null;
  approverId: string | null;
  createdAt: Date;
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
};
