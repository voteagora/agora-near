import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";

import { cn } from "@/lib/utils";
import { memo } from "react";
import { getProposalStatusColor } from "@/lib/nearProposalUtils";
export const NearProposalStatusText = memo(
  ({ proposal }: { proposal: ProposalInfo }) => {
    const { text } = getProposalStatusColor(proposal.status);

    return (
      <div className={cn(text, "capitalize")}>
        {proposal.status.toLowerCase()}
      </div>
    );
  }
);

NearProposalStatusText.displayName = "NearProposalStatusText";
