import { Button } from "@/components/ui/button";
import { useNear } from "@/contexts/NearContext";
import { useProposalActions } from "@/hooks/useProposalActions";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";
import { InfoIcon } from "lucide-react";

export const NearProposalActions = ({
  proposal,
}: {
  proposal: ProposalInfo;
}) => {
  const {
    approveProposal,
    isApprovingProposal,
    rejectProposal,
    isRejectingProposal,
    approveProposalError,
    rejectProposalError,
  } = useProposalActions();
  const { config } = useProposalConfig();
  const { signedAccountId } = useNear();

  const isLoading = isApprovingProposal || isRejectingProposal;

  const isReviewer =
    signedAccountId && config?.reviewer_ids.includes(signedAccountId);

  if (proposal?.status !== ProposalStatus.Created) {
    return null;
  }

  return (
    <div
      className={`w-full flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-center align-middle border border-line p-4 mb-6 rounded-md bg-neutral text-sm text-primary`}
    >
      <div className="ml-4 flex items-center gap-2">
        <InfoIcon className="h-4 w-4 text-muted-foreground hidden sm:block" />
        This proposal is awaiting approval from a House of Stake reviewer
      </div>
      {isReviewer && (
        <div className="flex w-full sm:w-auto flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="min-w-[100px]"
              variant="outline"
              disabled={isLoading}
              onClick={() => approveProposal(proposal.id)}
            >
              {isApprovingProposal
                ? "Approving..."
                : approveProposalError
                  ? "Error - try again"
                  : "Approve"}
            </Button>
            <Button
              className="min-w-[100px]"
              disabled={isLoading}
              variant="destructive"
              onClick={() => rejectProposal(proposal.id)}
            >
              {isRejectingProposal
                ? "Rejecting..."
                : rejectProposalError
                  ? "Error - try again"
                  : "Reject"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
