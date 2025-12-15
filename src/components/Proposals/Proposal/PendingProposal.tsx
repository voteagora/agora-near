import { ProposalInfo } from "@/lib/contracts/types/voting";
import Markdown from "@/components/shared/Markdown/Markdown";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useNear } from "@/contexts/NearContext";
import { Button } from "@/components/ui/button";
import { useProposalActions } from "@/hooks/useProposalActions";
import { toast } from "react-hot-toast";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { decodeMetadata, ProposalType } from "@/lib/proposalMetadata";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const PendingProposal = ({ proposal }: { proposal: ProposalInfo }) => {
  const router = useRouter();

  const { config, votingDuration } = useProposalConfig();
  const { signedAccountId } = useNear();
  const { metadata, description: cleanDescription } = decodeMetadata(
    proposal.description || ""
  );

  const isReviewer =
    signedAccountId && config?.reviewer_ids.includes(signedAccountId);

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
      <section className="flex gap-8 flex-col md:flex-row">
        <section className="px-4 flex-1 w-full">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{proposal.title}</h1>
            {metadata?.proposalType &&
              metadata.proposalType !== ProposalType.Standard && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="px-2 py-1 text-xs font-semibold rounded-full border bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer uppercase"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {metadata.proposalType.replace(/([A-Z])/g, " $1").trim()}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">
                        {metadata.proposalType
                          .replace(/([A-Z])/g, " $1")
                          .trim()}{" "}
                        Proposal
                      </h4>
                      <p className="text-sm text-secondary">
                        This proposal includes custom configuration metadata.
                        <br />
                        This will be verified by the contract.
                      </p>
                      <div className="flex flex-col gap-1 border-t pt-2 mt-2">
                        {metadata.quorumThreshold && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-secondary">
                              Quorum Threshold:
                            </span>
                            <span className="font-medium text-primary">
                              {metadata.quorumThreshold.toLocaleString()} votes
                            </span>
                          </div>
                        )}
                        {metadata.approvalThreshold && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-secondary">
                              Approval Threshold:
                            </span>
                            <span className="font-medium text-primary">
                              {metadata.approvalThreshold.toLocaleString()}{" "}
                              votes
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
          </div>
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
            <Markdown content={cleanDescription ?? ""} />
          </section>
        </section>
        <section className="max-md:p-4 w-full md:w-[20rem] lg:w-[24rem] flex flex-col gap-2">
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
