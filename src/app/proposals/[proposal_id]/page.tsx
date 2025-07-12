import ProposalHome from "@/components/Proposals/Proposal/ProposalHome";
import React from "react";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function Page({
  params: { proposal_id },
}: {
  params: { proposal_id: string };
}) {
  return <ProposalHome proposalId={proposal_id} />;
}
