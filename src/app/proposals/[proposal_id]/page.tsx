import ProposalHome from "@/components/Proposals/Proposal/ProposalHome";
import React from "react";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function Page({
  params: { proposal_id },
}: {
  params: { proposal_id: string };
}) {
  return (
    <div className="min-h-[calc(100vh-240px)]">
      <ProposalHome proposalId={proposal_id} />
    </div>
  );
}
