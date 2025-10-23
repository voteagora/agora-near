"use client";

import AgoraLoader from "@/components/shared/AgoraLoader/AgoraLoader";
import { useProposal } from "@/hooks/useProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useProposalQuorum } from "@/hooks/useProposalQuorum";
import { ProposalStatus } from "@/lib/contracts/types/voting";
import { useMemo } from "react";
import { PendingProposal } from "./PendingProposal";
import ProposalDescription from "./ProposalDescription";
import ProposalVoteResult from "./ProposalVoteResult";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default function ProposalHome({ proposalId }: { proposalId: string }) {
  const { proposal, isLoading: isLoadingProposal } = useProposal(proposalId);
  const { config, isLoading: isConfigLoading } = useProposalConfig();
  const { quorumAmountYoctoNear, isLoading: isLoadingQuorumAmount } =
    useProposalQuorum({
      proposalId,
    });

  const proposalWithQuorum = useMemo(() => {
    return proposal ? { ...proposal, quorumAmountYoctoNear } : null;
  }, [proposal, quorumAmountYoctoNear]);

  const isLoading =
    isLoadingProposal || isConfigLoading || isLoadingQuorumAmount;

  if (isLoading) {
    return <AgoraLoader />;
  }

  if (!proposalWithQuorum || !config) {
    return <div>Proposal not found</div>;
  }

  if (proposalWithQuorum.status === ProposalStatus.Created) {
    return <PendingProposal proposal={proposalWithQuorum} />;
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <div className="flex gap-8 lg:gap-16 justify-between items-start max-w-desktop w-full flex-col md:flex-row md:items-start md:justify-between">
        <ProposalDescription proposal={proposalWithQuorum} />
        <div className="w-full md:max-w-[24rem]">
          <ProposalVoteResult proposal={proposalWithQuorum} config={config} />
        </div>
      </div>
      {/* Mobile-only spacer to prevent overlap with modal/circle */}
      <div className="block md:hidden" style={{ height: 65 }} />
    </div>
  );
}
