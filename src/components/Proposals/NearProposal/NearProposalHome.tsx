"use client";

import { useProposal } from "@/hooks/useProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import NearProposalDescription from "./NearProposalDescription";
import NearProposalVoteResult from "./NearProposalVoteResult";
import { NearPendingProposal } from "./NearPendingProposal";
import { ProposalStatus } from "@/lib/contracts/types/voting";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default function NearProposalHome({
  proposalId,
}: {
  proposalId: string;
}) {
  const { proposal, isLoading } = useProposal(proposalId);
  const { config, isLoading: isConfigLoading } = useProposalConfig();

  if (isLoading || isConfigLoading) {
    return (
      <div
        className="flex flex-row gl_loader justify-center py-6 text-sm text-secondary"
        key="loader"
      >
        Loading...
      </div>
    );
  }

  if (!proposal || !config) {
    return <div>Proposal not found</div>;
  }

  if (proposal.status === ProposalStatus.Created) {
    return <NearPendingProposal proposal={proposal} />;
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <div className="flex gap-8 lg:gap-16 justify-between items-start max-w-[1280px] w-full flex-col md:flex-row md:items-start md:justify-between">
        <NearProposalDescription proposal={proposal} />
        <NearProposalVoteResult proposal={proposal} config={config} />
      </div>
    </div>
  );
}
