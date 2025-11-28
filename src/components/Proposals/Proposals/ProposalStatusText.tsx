import { Proposal } from "@/lib/api/proposal/types";
import { getProposalStatus, getProposalStatusColor } from "@/lib/proposalUtils";
import { cn } from "@/lib/utils";
import { memo } from "react";

export const ProposalStatusText = memo(
  ({ proposal }: { proposal: Proposal }) => {
    const status = getProposalStatus({
      status: proposal.status ?? "",
      quorumAmount: proposal.quorumAmountYoctoNear ?? "0",
      forVotingPower: proposal.forVotingPower ?? "0",
      againstVotingPower: proposal.againstVotingPower ?? "0",
      abstainVotingPower: proposal.abstainVotingPower ?? "0",
    });

    const { text } = getProposalStatusColor(status);

    return (
      <div className={cn(text, "capitalize")}>{status?.toLowerCase()}</div>
    );
  }
);

ProposalStatusText.displayName = "ProposalStatusText";
