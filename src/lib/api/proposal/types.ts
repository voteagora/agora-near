export type ProposalVotingHistoryRecord = {
  accountId: string;
  votingPower: string;
  voteOption: string;
  votedAt: number;
};

export type ProposalNonVotersRecord = {
  id: string;
  proposalId: number;
  registeredVoterId: string;
};
