"use client";

import React from "react";
import { useProposals } from "@/hooks/useProposals";
import NearProposalDescription from "./NearProposalDescription";
import NearProposalOptionsResult from "./NearProposalOptionsResult";
import NearProposalVoteResult from "./NearProposalVoteResult";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default function NearProposalHome({
  proposalId,
}: {
  proposalId: string;
}) {
  const { proposals, isLoading: isLoadingProposals } = useProposals(0, 10);

  const proposal = proposals.find((p) => String(p.id) === proposalId);

  if (isLoadingProposals) {
    return (
      <div
        className="flex flex-row gl_loader justify-center py-6 text-sm text-secondary"
        key="loader"
      >
        Loading...
      </div>
    );
  }

  if (!proposal) {
    return <div>Proposal not found</div>;
  }

  return (
    <div className="flex justify-between mt-12">
      <div className="flex flex-col">
        <div className="flex gap-16 justify-between items-start max-w-[76rem] flex-col sm:flex-row sm:items-start sm:justify-between">
          <NearProposalDescription proposal={proposal} />
          {proposal.voting_options.length !== 2 && (
            <NearProposalOptionsResult proposal={proposal} />
          )}
          {proposal.voting_options.length === 2 && (
            <NearProposalVoteResult proposal={proposal} />
          )}
        </div>
      </div>
    </div>
  );
}
