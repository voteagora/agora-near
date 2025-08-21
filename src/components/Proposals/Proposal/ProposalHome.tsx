"use client";

import { useProposal } from "@/hooks/useProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import ProposalDescription from "./ProposalDescription";
import ProposalVoteResult from "./ProposalVoteResult";
import { PendingProposal } from "./PendingProposal";
import { ProposalStatus } from "@/lib/contracts/types/voting";
import AgoraLoader from "@/components/shared/AgoraLoader/AgoraLoader";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default function ProposalHome({ proposalId }: { proposalId: string }) {
  const { proposal, isLoading } = useProposal(proposalId);
  const { config, isLoading: isConfigLoading } = useProposalConfig();

  if (isLoading || isConfigLoading) {
    return <AgoraLoader />;
  }

  if (!proposal || !config) {
    return <div>Proposal not found</div>;
  }

  if (proposal.status === ProposalStatus.Created) {
    return <PendingProposal proposal={proposal} />;
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <div className="flex gap-8 lg:gap-16 justify-between items-start max-w-desktop w-full flex-col md:flex-row md:items-start md:justify-between">
        <ProposalDescription proposal={proposal} />
        <div className="w-full md:max-w-[24rem]">
          <ProposalVoteResult proposal={proposal} config={config} />
        </div>
      </div>
      {/* Mobile-only spacer to prevent overlap with modal/circle */}
      <div className="block md:hidden" style={{ height: 65 }} />
    </div>
  );
}
