import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";

import { cn } from "@/lib/utils";
import { memo } from "react";

export const NearProposalStatusText = memo(
  ({ proposal }: { proposal: ProposalInfo }) => {
    return (
      <div
        className={cn(
          proposal.status === ProposalStatus.Finished && "text-positive",
          "capitalize"
        )}
      >
        {proposal.status.toLowerCase()}
      </div>
    );
  }
);

NearProposalStatusText.displayName = "NearProposalStatusText";
