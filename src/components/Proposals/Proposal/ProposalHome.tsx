"use client";

import AgoraLoader from "@/components/shared/AgoraLoader/AgoraLoader";
import { useProposal } from "@/hooks/useProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useProposalQuorum } from "@/hooks/useProposalQuorum";
import { enrichProposal } from "@/lib/proposalUtils";
import Link from "next/link";
import ProposalDescription from "./ProposalDescription";
import ProposalVoteResult from "./ProposalVoteResult";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default function ProposalHome({ proposalId }: { proposalId: string }) {
  const { proposal, isLoading: isLoadingProposal } = useProposal(proposalId);
  const { config, isLoading: isConfigLoading } = useProposalConfig();
  const { quorumAmount, isLoading: isLoadingQuorumAmount } = useProposalQuorum({
    proposalId,
  });

  const isLoading =
    isLoadingProposal || isConfigLoading || isLoadingQuorumAmount;

  if (isLoading) {
    return <AgoraLoader />;
  }

  if (!proposal || !config) {
    return <div>Proposal not found</div>;
  }

  const proposalWithQuorum = enrichProposal({
    ...proposal,
    quorumAmount: quorumAmount ?? undefined,
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <Link
        href="/proposals"
        className="text-sm text-secondary hover:text-primary transition-colors mb-0 w-fit"
      >
        ← Back to proposals
      </Link>

      <div className="flex flex-col md:flex-row gap-8 relative items-start">
        <ProposalDescription proposal={proposalWithQuorum} />
        <ProposalVoteResult proposal={proposalWithQuorum} config={config} />
      </div>
    </div>
  );
}
