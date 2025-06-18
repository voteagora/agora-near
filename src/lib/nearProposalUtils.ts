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
  if (proposal.status === ProposalStatus.Finished) {
    const quorumFulfilled = isQuorumFulfilled(proposal);
    const forGreaterThanAgainst = isForGreaterThanAgainst(proposal);

    return quorumFulfilled && forGreaterThanAgainst
      ? ProposalDisplayStatus.Succeeded
      : ProposalDisplayStatus.Defeated;
  } else if (proposal.status === ProposalStatus.Created) {
    return ProposalDisplayStatus.Active;
  }
  return proposal.status;
}

export function getProposalStatusColor(
  proposalStatus: ProposalStatus | ProposalDisplayStatus
) {
  switch (proposalStatus) {
    case ProposalStatus.Voting:
      return {
        text: "text-blue-600",
        bg: "bg-sky-200",
      };
    case ProposalStatus.Finished:
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
    case ProposalStatus.Approved:
      return {
        text: "text-blue-600",
        bg: "bg-sky-200",
      };
    case ProposalStatus.Created:
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

export const getPreciseNearQuorum = (proposal: ProposalInfo) => {
  const quorumPercentage = Big(
    process.env.NEXT_PUBLIC_NEAR_QUORUM_THRESHOLD_PERCENTAGE ?? "0.30"
  );
  return Big(proposal.snapshot_and_state?.total_venear ?? 0).mul(
    quorumPercentage
  );
};

export const getNearQuorum = (proposal: ProposalInfo) => {
  const nearQuorum = getPreciseNearQuorum(proposal);

  return nearQuorum.round(0, 3).toNumber();
};

const getTotalForAgainstVotes = (proposal: ProposalInfo) => {
  return Big(proposal.votes[0].total_venear).plus(
    proposal.votes[1].total_venear
  );
};

export const isQuorumFulfilled = (proposal: ProposalInfo) => {
  const quorum = getPreciseNearQuorum(proposal);
  const totalForAgainstVotes = getTotalForAgainstVotes(proposal);
  return totalForAgainstVotes.gte(quorum);
};
