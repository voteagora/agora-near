import {
  ProposalInfo,
  ProposalStatus,
  ProposalDisplayStatus,
  VoterStats,
} from "./contracts/types/voting";
import { format } from "date-fns";
import Big from "big.js";

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

export const isForGreaterThanAgainst = (proposal: ProposalInfo) => {
  const votedFor = Big(proposal.votes[0].total_venear);
  const votedAgainst = Big(proposal.votes[1].total_venear);
  return votedFor.gt(votedAgainst);
};

export function getProposalStatus(proposal: ProposalInfo) {
  switch (proposal.status) {
    case ProposalStatus.Finished: {
      const quorumFulfilled = isQuorumFulfilled(proposal);
      const forGreaterThanAgainst = isForGreaterThanAgainst(proposal);
      return quorumFulfilled && forGreaterThanAgainst
        ? ProposalDisplayStatus.Succeeded
        : ProposalDisplayStatus.Defeated;
    }
    case ProposalStatus.Created:
    case ProposalStatus.Approved:
    case ProposalStatus.Voting:
      return ProposalDisplayStatus.Active;
    default:
      return proposal.status;
  }
}

export function getProposalStatusColor(proposalStatus: string) {
  switch (proposalStatus) {
    case ProposalDisplayStatus.Succeeded:
      return {
        text: "text-green-600",
        bg: "bg-green-200",
      };
    case ProposalStatus.Rejected:
    case ProposalDisplayStatus.Defeated:
      return {
        text: "text-red-600",
        bg: "bg-red-200",
      };
    case ProposalDisplayStatus.Active:
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

export const formatNearTime = (time: string | null | undefined) => {
  return time ? format(Number(time) / 1000000, "h:mm aaa MMM dd, yyyy") : null;
};

export const getNearProposalTimes = (proposal: ProposalInfo) => {
  const endTime =
    proposal.voting_start_time_ns && proposal.voting_duration_ns
      ? Number(proposal.voting_start_time_ns) +
        Number(proposal.voting_duration_ns)
      : null;

  return {
    createdTime: formatNearTime(proposal.creation_time_ns),
    startTime: formatNearTime(proposal.voting_start_time_ns),
    endTime: formatNearTime(endTime?.toString()),
  };
};

export const getVenearForQuorum = (proposal: ProposalInfo) => {
  const quorumPercentage = Big(
    process.env.NEXT_PUBLIC_NEAR_QUORUM_THRESHOLD_PERCENTAGE ?? "0.30"
  );
  return Big(proposal.snapshot_and_state?.total_venear ?? 0).mul(
    quorumPercentage
  );
};

export const getQuorumPercentage = () =>
  Number(process.env.NEXT_PUBLIC_NEAR_QUORUM_THRESHOLD_PERCENTAGE ?? "0.30") *
  100;

export const getTotalForAgainstVotes = (proposal: ProposalInfo) => {
  return Big(proposal.votes[0].total_venear).plus(
    proposal.votes[1].total_venear
  );
};

export const isQuorumFulfilled = (proposal: ProposalInfo) => {
  const quorum = getVenearForQuorum(proposal);
  const totalForAgainstVotes = getTotalForAgainstVotes(proposal);
  return totalForAgainstVotes.gte(quorum);
};
