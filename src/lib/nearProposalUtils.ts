import {
  ProposalInfo,
  ProposalStatus,
  VoterStats,
} from "./contracts/types/voting";

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

export function getProposalStatusColor(proposalStatus: ProposalStatus) {
  switch (proposalStatus) {
    case ProposalStatus.Voting:
      return {
        text: "text-blue-600",
        bg: "bg-sky-200",
      };
    case ProposalStatus.Finished:
      return {
        text: "text-green-600",
        bg: "bg-green-200",
      };
    case ProposalStatus.Rejected:
      return {
        text: "text-red-600",
        bg: "bg-red-200",
      };
    case ProposalStatus.Approved:
      return {
        text: "text-blue-600",
        bg: "bg-sky-200",
      };
    case ProposalStatus.Created:
      return {
        text: "text-blue-600",
        bg: "bg-blue-200",
      };
    default:
      return {
        text: "text-gray-600",
        bg: "bg-gray-200",
      };
  }
}
