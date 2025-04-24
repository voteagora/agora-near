// Use client for local timezone instead of server timezone
"use client";

import { HStack } from "@/components/Layout/Stack";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { format } from "date-fns";

export default function NearProposalTimeStatus({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const votingStartTime = proposal.voting_start_time_ns
    ? Number(proposal.voting_start_time_ns) / 1000000
    : null;
  const votingDuration = proposal.voting_duration_ns
    ? Number(proposal.voting_duration_ns) / 1000000
    : null;
  const votingEndTime =
    votingStartTime && votingDuration
      ? new Date(votingStartTime + votingDuration)
      : null;

  const activeProposalStartTime = votingStartTime
    ? format(votingStartTime, "h:mm aaa MMM dd, yyyy")
    : null;

  const activeProposalEndTime = votingEndTime
    ? format(votingEndTime, "h:mm aaa MMM dd, yyyy")
    : null;

  switch (proposal.status) {
    case "Created":
      return <HStack gap={1}>Starts {activeProposalStartTime}</HStack>;

    case "ACTIVE":
      return <HStack gap={1}>Ends {activeProposalEndTime}</HStack>;

    case "Finished":
      return <HStack gap={1}>Finished {activeProposalEndTime}</HStack>;

    default:
      return <HStack gap={1}>Ended {activeProposalEndTime}</HStack>;
  }
}
