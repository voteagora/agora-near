import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import NearProposalTimeStatus from "../NearProposals/NearProposalTimeStatus";

export default function NearProposalStatusDetail({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const proposalStatus = proposal.status;

  const proposalStatusColor = useMemo(() => {
    switch (proposalStatus) {
      case ProposalStatus.Voting:
        return "text-blue-600 bg-sky-200";
      case ProposalStatus.Finished:
        return "text-green-600 bg-green-200";
      case ProposalStatus.Rejected:
        return "text-red-600 bg-red-200";
      case ProposalStatus.Approved:
        return "text-blue-600 bg-sky-200";
      case ProposalStatus.Created:
        return "text-blue-600 bg-blue-200";
      default:
        return "text-gray-600 bg-gray-200";
    }
  }, [proposalStatus]);

  return (
    <div className="flex flex-row justify-between items-center gap-4 bg-wash border-t border-line -mx-4 px-4 py-2 text-secondary rounded-b-md text-xs">
      <div>
        <p
          className={cn(
            proposalStatusColor,
            "rounded-sm px-1 py-0.5 font-semibold"
          )}
        >
          {proposalStatus.toUpperCase()}
        </p>
      </div>
      <div>
        <NearProposalTimeStatus
          proposalStatus={proposalStatus}
          proposalCreateTime={proposal.creation_time_ns}
          proposalStartTime={proposal.voting_start_time_ns}
          proposalDuration={proposal.voting_duration_ns}
        />
      </div>
    </div>
  );
}
