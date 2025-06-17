import {
  ProposalInfo,
  ProposalStatus,
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

export const isQuorumFulfilled = (proposal: ProposalInfo) => {
  const quorum = getNearQuorum(proposal);
  const qorum = getNearQorum(proposal);
  return qorum >= quorum;
};

export const isForGreaterThanAgainst = (proposal: ProposalInfo) => {
  const votedFor = Big(proposal.votes[0].total_venear);
  const votedAgainst = Big(proposal.votes[1].total_venear);
  return votedFor.gt(votedAgainst);
};

export function getProposalStatus(proposal: ProposalInfo) {
  let status = proposal.status;
  if (status === ProposalStatus.Finished) {
    const quorumFulfilled = isQuorumFulfilled(proposal);

    if (!quorumFulfilled) {
      status = ProposalStatus.Defeated;
    } else {
      const forGreaterThanAgainst = isForGreaterThanAgainst(proposal);

      if (forGreaterThanAgainst) {
        status = ProposalStatus.Succeeded;
      } else {
        status = ProposalStatus.Defeated;
      }
    }
  }
  return status;
}

export function getProposalStatusColor(proposalStatus: ProposalStatus) {
  switch (proposalStatus) {
    case ProposalStatus.Voting:
      return {
        text: "text-blue-600",
        bg: "bg-sky-200",
      };
    case ProposalStatus.Finished:
    case ProposalStatus.Succeeded:
      return {
        text: "text-green-600",
        bg: "bg-green-200",
      };
    case ProposalStatus.Rejected:
    case ProposalStatus.Defeated:
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

export const getNearQuorum = (proposal: ProposalInfo) => {
  const quorumPercentage = Big(
    process.env.NEXT_PUBLIC_NEAR_QUORUM_THRESHOLD_PERCENTAGE ?? "0.30"
  );

  return Big(proposal.snapshot_and_state?.total_venear ?? 0)
    .mul(quorumPercentage)
    .round(0, 3)
    .toNumber();
};

export const getNearQorum = (proposal: ProposalInfo) => {
  return Big(proposal.votes[0].total_venear)
    .plus(proposal.votes[1].total_venear)
    .toNumber();
};
