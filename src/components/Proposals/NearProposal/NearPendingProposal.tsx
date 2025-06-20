import { ProposalInfo } from "@/lib/contracts/types/voting";
import Markdown from "@/components/shared/Markdown/Markdown";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useNear } from "@/contexts/NearContext";
import { Button } from "@/components/ui/button";
import { useProposalActions } from "@/hooks/useProposalActions";
import { toast } from "react-hot-toast";

export const NearPendingProposal = ({
  proposal,
}: {
  proposal: ProposalInfo;
}) => {
  const { config } = useProposalConfig();
  const { signedAccountId } = useNear();

  const isReviewer =
    signedAccountId && config?.reviewer_ids.includes(signedAccountId);

  const {
    approveProposal,
    isApprovingProposal,
    rejectProposal,
    isRejectingProposal,
    approveProposalError,
    rejectProposalError,
  } = useProposalActions({
    onApproveSuccess: () => {
      toast.success("Proposal approved");
    },
    onRejectSuccess: () => {
      toast.success("Proposal rejected");
    },
  });

  return (
    <section>
      <header className="py-8">
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
                href={`https://${proposal.link}`}
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
            Submitting your proposal will send it to the Screening Committee for
            review. Any committee member can approve it. Once approved, your
            proposal will go live for one day.
          </p>
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
              <Button
                onClick={() => rejectProposal(proposal.id)}
                variant="destructive"
                className="rounded-full w-full"
              >
                {isRejectingProposal
                  ? "Rejecting..."
                  : rejectProposalError
                    ? "Error - try again"
                    : "Reject Proposal"}
              </Button>
            </div>
          )}
        </section>
      </section>
    </section>
  );
};
