import { ProposalInfo, VoterStats } from "./contracts/types/voting";

export function votingOptionsToVoteStats(proposal: ProposalInfo) {
  return proposal.voting_options.reduce(
    (prev, curr, index) => {
      return {
        ...prev,
        [curr]: proposal.votes[index],
      };
    },
    {} as Record<string, VoterStats>
  );
}
