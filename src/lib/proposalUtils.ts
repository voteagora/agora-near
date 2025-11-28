import {
  convertNanoSecondsToDays,
  formatNanoSecondsToTimeUnit,
} from "@/lib/utils";
import Big from "big.js";
import { format } from "date-fns";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import {
  ProposalDisplayStatus,
  ProposalStatus,
} from "./contracts/types/voting";
import {
  DEFAULT_QUORUM_FLOOR_VENEAR,
  DEFAULT_QUORUM_THRESHOLD_PERCENTAGE,
} from "./constants";

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
  quorumAmount,
  forVotingPower,
  againstVotingPower,
  abstainVotingPower,
}: {
  status: string;
  quorumAmount: string;
  forVotingPower: string;
  againstVotingPower: string;
  abstainVotingPower: string;
}) {
  switch (status) {
    case ProposalStatus.Finished: {
      const quorumFulfilled = isQuorumFulfilled({
        quorumAmount,
        forVotingPower,
        againstVotingPower,
        abstainVotingPower,
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
  if (!time) return null;
  const date = new Date(Number(time) / 1000000);
  // Uses local time zone; "O" provides a short offset (e.g. GMT+2)
  return format(date, "h:mm aaa MMM dd, yyyy O");
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

const QUORUM_OVERRIDE_AMOUNT_IN_NEAR =
  process.env.NEXT_PUBLIC_NEAR_QUORUM_VENEAR_OVERRIDE;

const QUORUM_THRESHOLD_PERCENTAGE =
  process.env.NEXT_PUBLIC_NEAR_QUORUM_THRESHOLD_PERCENTAGE ??
  DEFAULT_QUORUM_THRESHOLD_PERCENTAGE;

const QUORUM_FLOOR_IN_NEAR =
  process.env.NEXT_PUBLIC_NEAR_QUORUM_FLOOR_VENEAR ??
  DEFAULT_QUORUM_FLOOR_VENEAR;

export const getYoctoNearForQuorum = (totalVotingPower: string) => {
  const isQuorumOverrideActive = getIsQuorumOverrideActive();

  if (isQuorumOverrideActive) {
    return Big(getQuorumOverrideYoctoNear());
  }

  const quorumPercentage = Big(QUORUM_THRESHOLD_PERCENTAGE);
  const quorumFloor = Big(getQuorumFloorYoctoNear());

  const percentageBasedQuorum = Big(totalVotingPower).mul(quorumPercentage);

  return percentageBasedQuorum.gt(quorumFloor)
    ? percentageBasedQuorum
    : quorumFloor;
};

export const getIsQuorumOverrideActive = (): boolean => {
  return !!QUORUM_OVERRIDE_AMOUNT_IN_NEAR;
};

export const getQuorumOverrideYoctoNear = () => {
  return parseNearAmount(QUORUM_OVERRIDE_AMOUNT_IN_NEAR) ?? "0";
};

export const getFormattedQuorumPercentage = () =>
  `${Number(QUORUM_THRESHOLD_PERCENTAGE) * 100}%`;

export const getQuorumFloorYoctoNear = () =>
  parseNearAmount(QUORUM_FLOOR_IN_NEAR) ?? "0";

export const getTotalVotes = (
  forVotingPower: string,
  againstVotingPower: string,
  abstainVotingPower: string
) => {
  return Big(forVotingPower).plus(againstVotingPower).plus(abstainVotingPower);
};

export const isQuorumFulfilled = ({
  quorumAmount,
  forVotingPower,
  againstVotingPower,
  abstainVotingPower,
}: {
  quorumAmount: string;
  forVotingPower: string;
  againstVotingPower: string;
  abstainVotingPower: string;
}) => {
  const totalVotes = getTotalVotes(
    forVotingPower,
    againstVotingPower,
    abstainVotingPower
  );
  return totalVotes.gte(quorumAmount);
};

export const getVotingDays = ({
  voting_duration_ns,
}: {
  voting_duration_ns: string;
}) => {
  // Preserve days wording for >= 1 day, otherwise provide a humanized unit
  const votingDays = convertNanoSecondsToDays(voting_duration_ns);
  if (votingDays >= 1) {
    return `${votingDays} ${votingDays === 1 ? "day" : "days"}`;
  }
  return formatNanoSecondsToTimeUnit(voting_duration_ns);
};
