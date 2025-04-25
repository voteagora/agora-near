// Use client for local timezone instead of server timezone
"use client";

import { HStack } from "@/components/Layout/Stack";
import { ProposalStatus } from "@/lib/contracts/types/voting";
import { format } from "date-fns";

export default function ProposalTimeStatus({
  proposalStatus,
  proposalCreateTime,
  proposalStartTime,
  proposalDuration,
}: {
  proposalStatus: ProposalStatus;
  proposalCreateTime: string | null;
  proposalStartTime: string | null;
  proposalDuration: string | null;
}) {
  const proposalEndTime =
    proposalStartTime && proposalDuration
      ? Number(proposalStartTime) + Number(proposalDuration)
      : null;

  const proposalEndTimeDisplay = proposalEndTime
    ? format(proposalEndTime / 1000000, "h:mm aaa MMM dd, yyyy")
    : null;

  const proposalCreateTimeDisplay = proposalCreateTime
    ? format(Number(proposalCreateTime) / 1000000, "h:mm aaa MMM dd, yyyy")
    : null;

  const proposalStartTimeDisplay = proposalStartTime
    ? format(Number(proposalStartTime) / 1000000, "h:mm aaa MMM dd, yyyy")
    : null;

  switch (proposalStatus) {
    case ProposalStatus.Created:
      return <HStack gap={1}>Created {proposalCreateTimeDisplay}</HStack>;

    case ProposalStatus.Voting:
      return <HStack gap={1}>Ends {proposalEndTimeDisplay}</HStack>;

    case ProposalStatus.Rejected:
      return <HStack gap={1}>Rejected</HStack>;

    case ProposalStatus.Approved:
      return <HStack gap={1}>Starts {proposalStartTimeDisplay}</HStack>;

    case ProposalStatus.Finished:
      return <HStack gap={1}>Finished {proposalEndTimeDisplay}</HStack>;
  }
}
