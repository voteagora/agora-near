import DraftProposalPage from "@/components/Proposals/DraftProposal/DraftProposalPage";
import React from "react";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return <DraftProposalPage draftId={id} />;
}
