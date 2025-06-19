import { ProposalInfo } from "@/lib/contracts/types/voting";

import { cn } from "@/lib/utils";
import { memo } from "react";
import {
  getProposalStatus,
  getProposalStatusColor,
} from "@/lib/nearProposalUtils";

export const NearProposalStatusText = memo(
  ({ proposal }: { proposal: ProposalInfo }) => {
    const status = getProposalStatus(proposal);

    const { text } = getProposalStatusColor(status);

    return <div className={cn(text, "capitalize")}>{status.toLowerCase()}</div>;
  }
);

NearProposalStatusText.displayName = "NearProposalStatusText";
