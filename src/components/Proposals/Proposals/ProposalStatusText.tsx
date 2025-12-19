import { Proposal } from "@/lib/api/proposal/types";
import {
  enrichProposal,
  getProposalStatus,
  getProposalStatusColor,
} from "@/lib/proposalUtils";
import { cn } from "@/lib/utils";
import { memo } from "react";

export const ProposalStatusText = memo(
  ({ proposal }: { proposal: Proposal }) => {
    const enriched = enrichProposal<Proposal>(proposal);
    const {
      status: baseStatus,
      quorumAmount,
      forVotingPower,
      againstVotingPower,
      abstainVotingPower,
      proposalType,
      approvalThreshold,
    } = enriched;

    const status = getProposalStatus({
      status: baseStatus ?? "",
      quorumAmount: quorumAmount ?? "0",
      forVotingPower: forVotingPower ?? "0",
      againstVotingPower: againstVotingPower ?? "0",
      abstainVotingPower: abstainVotingPower ?? "0",
      proposalType,
      approvalThreshold: approvalThreshold,
    });

    const { text } = getProposalStatusColor(status);

    return (
      <div className={cn(text, "capitalize")}>{status?.toLowerCase()}</div>
    );
  }
);

ProposalStatusText.displayName = "ProposalStatusText";
