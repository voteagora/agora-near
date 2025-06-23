import { ProposalInfo } from "@/lib/contracts/types/voting";
import Markdown from "@/components/shared/Markdown/Markdown";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useNear } from "@/contexts/NearContext";
import { Button } from "@/components/ui/button";
import { useProposalActions } from "@/hooks/useProposalActions";
import { toast } from "react-hot-toast";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getVotingDays } from "@/lib/nearProposalUtils";

export const NearPendingProposal = ({
  proposal,
}: {
  proposal: ProposalInfo;
}) => {
  const router = useRouter();

  const { config } = useProposalConfig();
  const { signedAccountId } = useNear();

  const isReviewer =
    signedAccountId && config?.reviewer_ids.includes(signedAccountId);

  const votingDuration = config ? getVotingDays(config) : "";

  const { approveProposal, isApprovingProposal, approveProposalError } =
    useProposalActions({
      onApproveSuccess: () => {
        toast.success("Proposal approved");
      },
    });

  return (
    <section>
      <header className="py-8 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <p className="text-lg font-semibold">Proposal</p>
      </header>
      <section className="flex gap-8">
        <section className="px-4 flex-1">
          <h1 className="text-2xl font-bold">{proposal.title}</h1>
          <p>Submitted by: {proposal.proposer_id}</p>
          <section className="mt-8 px-4 py-6 border border-secondary/20 rounded-md gap-4 flex flex-col">
            <div className="border border-secondary/20">
              <header className="bg-gray-200 text-secondary p-2">
                Project Link
              </header>
              <a
                className="flex underline text-primary m-4"
                href={
                  proposal.link?.includes("https://") ||
                  proposal.link?.includes("http://")
                    ? proposal.link
                    : `https://${proposal.link}`
                }
                target="_blank"
                rel="noreferrer noopener"
              >
                {proposal.link}
              </a>
            </div>
            <Markdown content={proposal.description ?? ""} />
          </section>
        </section>
        <section className="w-80 flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Pending Approval</h2>
          <p className="text-sm text-secondary">
            {isReviewer
              ? "As a member of the Screening Committee, you can approve this proposal."
              : `Submitting your proposal will send it to the Screening Committee for review. Any committee member can approve it. Once approved, your proposal will go live for ${votingDuration}.`}
          </p>
          {isReviewer && (
            <p className="text-sm text-secondary">
              Please follow your committee&apos;s approval guidelines. If
              approved, the proposal will go live for a {votingDuration} vote.
            </p>
          )}
          {isReviewer && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => approveProposal(proposal.id)}
                className="rounded-full w-full"
              >
                {isApprovingProposal
                  ? "Approving..."
                  : approveProposalError
                    ? "Error - try again"
                    : "Approve Proposal"}
              </Button>
            </div>
          )}
        </section>
      </section>
    </section>
  );
};
