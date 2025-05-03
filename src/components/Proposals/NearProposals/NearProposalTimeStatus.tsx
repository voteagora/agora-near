// Use client for local timezone instead of server timezone
"use client";

import { HStack } from "@/components/Layout/Stack";
import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";
import { getNearProposalTimes } from "@/lib/nearProposalUtils";

export default function ProposalTimeStatus({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const {
    createdTime: proposalCreateTimeDisplay,
    startTime: proposalStartTimeDisplay,
    endTime: proposalEndTimeDisplay,
  } = getNearProposalTimes(proposal);

  const { status: proposalStatus } = proposal;

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
