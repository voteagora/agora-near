import ProposalHome from "@/components/Proposals/Proposal/ProposalHome";
import { fetchProposal } from "@/lib/api/proposal/requests";
import { cleanString, truncateString } from "@/lib/text";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function generateMetadata({
  params,
}: {
  params: { proposal_id: string };
}): Promise<Metadata> {
  const proposalId = params.proposal_id;

  const proposal = await fetchProposal(proposalId);

  const title = truncateString(cleanString(proposal?.title || ""), 40);
  const description = truncateString(
    cleanString(proposal?.description || ""),
    80
  );

  const preview = `/api/images/og/generic?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}`;

  return {
    title: title,
    description: description,
    openGraph: {
      images: [
        {
          url: preview,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({
  params: { proposal_id },
}: {
  params: { proposal_id: string };
}) {
  return <ProposalHome proposalId={proposal_id} />;
}
