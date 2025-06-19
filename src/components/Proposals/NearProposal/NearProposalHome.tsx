"use client";

import { useProposal } from "@/hooks/useProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import NearProposalDescription from "./NearProposalDescription";
import NearProposalVoteResult from "./NearProposalVoteResult";
import { NearProposalActions } from "./NearProposalActions";

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

  return (
    <div className="flex flex-col items-center mt-12">
      <NearProposalActions proposal={proposal} />

      <div className="flex gap-16 justify-between items-start max-w-[76rem] w-full flex-col sm:flex-row">
        <div className="flex flex-col gap-4 w-full sm:w-[calc(100%-24rem)]">
          <NearProposalDescription proposal={proposal} />
        </div>
        <NearProposalVoteResult proposal={proposal} config={config} />
      </div>
    </div>
  );
}
