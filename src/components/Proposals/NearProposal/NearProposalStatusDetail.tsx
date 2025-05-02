import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import NearProposalTimeStatus from "../NearProposals/NearProposalTimeStatus";
import { getProposalStatusColor } from "@/lib/nearProposalUtils";

export default function NearProposalStatusDetail({
  proposal,
  className,
}: {
  proposal: ProposalInfo;
  className?: string;
}) {
  const proposalStatus = proposal.status;

  const { text, bg } = getProposalStatusColor(proposalStatus);

  return (
    <div
      className={cn(
        className,
        "flex flex-row justify-between items-center gap-4 bg-wash px-4 py-2 text-secondary rounded-b-md text-xs"
      )}
    >
      <div>
        <p className={cn(text, bg, "rounded-sm px-1 py-0.5 font-semibold")}>
          {proposalStatus.toUpperCase()}
        </p>
      </div>
      <div className="font-normal">
        <NearProposalTimeStatus proposal={proposal} />
      </div>
    </div>
  );
}
