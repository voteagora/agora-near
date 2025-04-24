// Use client for local timezone instead of server timezone
"use client";

import { HStack } from "@/components/Layout/Stack";
import { format } from "date-fns";

export default function ProposalTimeStatus({
  proposalStatus,
  proposalCreateTime,
  proposalStartTime,
  proposalDuration,
}: {
  proposalStatus: string;
  proposalCreateTime: string | null;
  proposalStartTime: string | null;
  proposalDuration: string | null;
}) {
  const proposalEndTime =
    proposalStartTime && proposalDuration
      ? Number(proposalStartTime) + Number(proposalDuration)
      : null;

  const proposalDEndTimeDisplay = proposalEndTime
    ? format(proposalEndTime / 1000000, "h:mm aaa MMM dd, yyyy")
    : null;

  const proposalCreateTimeDisplay = proposalCreateTime
    ? format(Number(proposalCreateTime) / 1000000, "h:mm aaa MMM dd, yyyy")
    : null;

  switch (proposalStatus) {
    case "Finished":
      return <HStack gap={1}>Finished at {proposalDEndTimeDisplay}</HStack>;

    case "Created":
    default:
      return <HStack gap={1}>Created at {proposalCreateTimeDisplay}</HStack>;
  }
}
