// Use client for local timezone instead of server timezone
"use client";

import { HStack } from "@/components/Layout/Stack";
import { ProposalStatus } from "@/lib/contracts/types/voting";
import { getProposalTimes } from "@/lib/proposalUtils";

export default function ProposalTimeStatus({
  votingDurationNs,
  votingStartTimeNs,
  votingCreationTimeNs,
  status,
}: {
  votingDurationNs: string;
  votingStartTimeNs: string;
  votingCreationTimeNs: string;
  status: string;
}) {
  const {
    createdTime: proposalCreateTimeDisplay,
    startTime: proposalStartTimeDisplay,
    endTime: proposalEndTimeDisplay,
  } = getProposalTimes({
    votingDurationNs,
    votingStartTimeNs,
    votingCreationTimeNs,
  });

  switch (status) {
    case ProposalStatus.Created:
      return (
        <HStack gap={1} className="whitespace-nowrap">
          Created {proposalCreateTimeDisplay}
        </HStack>
      );

    case ProposalStatus.Voting:
      return (
        <HStack gap={1} className="whitespace-nowrap">
          Ends {proposalEndTimeDisplay}
        </HStack>
      );

    case ProposalStatus.Rejected:
      return <HStack gap={1}>Rejected</HStack>;

    case ProposalStatus.Approved:
      return (
        <HStack gap={1} className="whitespace-nowrap">
          Starts {proposalStartTimeDisplay}
        </HStack>
      );

    case ProposalStatus.Finished:
      return (
        <HStack gap={1} className="whitespace-nowrap">
          Finished {proposalEndTimeDisplay}
        </HStack>
      );
  }
}
