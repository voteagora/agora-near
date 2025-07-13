import { convertNanoSecondsToDays } from "@/lib/utils";
import Big from "big.js";
import { format } from "date-fns";
import {
  ProposalDisplayStatus,
  ProposalStatus,
  VotingConfig,
} from "./contracts/types/voting";

export const isForGreaterThanAgainst = ({
  forVotingPower,
  againstVotingPower,
}: {
  forVotingPower: string;
  againstVotingPower: string;
}) => {
  const votedFor = Big(forVotingPower ?? 0);
  const votedAgainst = Big(againstVotingPower ?? 0);
  return votedFor.gt(votedAgainst);
};

export function getProposalStatus({
  status,
  totalVotingPower,
  forVotingPower,
  againstVotingPower,
}: {
  status: string;
  totalVotingPower: string;
  forVotingPower: string;
  againstVotingPower: string;
}) {
  switch (status) {
    case ProposalStatus.Finished: {
      const quorumFulfilled = isQuorumFulfilled({
        totalVotingPower,
        forVotingPower,
        againstVotingPower,
      });
      const forGreaterThanAgainst = isForGreaterThanAgainst({
        forVotingPower,
        againstVotingPower,
      });
      return quorumFulfilled && forGreaterThanAgainst
        ? ProposalDisplayStatus.Succeeded
        : ProposalDisplayStatus.Defeated;
    }
    case ProposalStatus.Created:
    case ProposalStatus.Approved:
    case ProposalStatus.Voting:
      return ProposalDisplayStatus.Active;
    default:
      return status;
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

export const getProposalTimes = ({
  votingDurationNs,
  votingStartTimeNs,
  votingCreationTimeNs,
}: {
  votingDurationNs?: string | null;
  votingStartTimeNs?: string | null;
  votingCreationTimeNs?: string | null;
}) => {
  const endTimeNs =
    votingStartTimeNs && votingDurationNs
      ? Number(votingStartTimeNs) + Number(votingDurationNs)
      : null;

  return {
    createdTime: formatNearTime(votingCreationTimeNs),
    startTime: formatNearTime(votingStartTimeNs),
    endTime: formatNearTime(endTimeNs?.toString()),
  };
};

export const getVenearForQuorum = (totalVotingPower: string) => {
  const quorumPercentage = Big(
    process.env.NEXT_PUBLIC_NEAR_QUORUM_THRESHOLD_PERCENTAGE ?? "0.30"
  );
  return Big(totalVotingPower).mul(quorumPercentage);
};

export const getQuorumPercentage = () =>
  Number(process.env.NEXT_PUBLIC_NEAR_QUORUM_THRESHOLD_PERCENTAGE ?? "0.30") *
  100;

export const getTotalForAgainstVotes = (
  forVotingPower: string,
  againstVotingPower: string
) => {
  return Big(forVotingPower).plus(againstVotingPower);
};

export const isQuorumFulfilled = ({
  totalVotingPower,
  forVotingPower,
  againstVotingPower,
}: {
  totalVotingPower: string;
  forVotingPower: string;
  againstVotingPower: string;
}) => {
  const quorum = getVenearForQuorum(totalVotingPower);
  const totalForAgainstVotes = getTotalForAgainstVotes(
    forVotingPower,
    againstVotingPower
  );
  return totalForAgainstVotes.gte(quorum);
};

export const getVotingDays = (votingConfig: VotingConfig) => {
  const votingDays = convertNanoSecondsToDays(votingConfig.voting_duration_ns);
  const votingDuration = `${votingDays} ${votingDays === 1 ? "day" : "days"}`;
  return votingDuration;
};
