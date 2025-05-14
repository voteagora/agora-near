import { Button } from "@/components/ui/button";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useNear } from "@/contexts/NearContext";
import { useProposalActions } from "@/hooks/useProposalActions";
import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";

export const NearProposalActions = ({
  proposal,
}: {
  proposal: ProposalInfo;
}) => {
  const {
    approveProposal,
    isApprovingProposal,
    approveProposalError,
    rejectProposal,
    isRejectingProposal,
    rejectProposalError,
  } = useProposalActions();

  const { config } = useProposalConfig();
  const { signedAccountId } = useNear();

  const isReviewer =
    signedAccountId && config?.reviewer_ids.includes(signedAccountId);

  if (proposal?.status !== ProposalStatus.Created) {
    return null;
  }

  return (
    <div className="w-full flex flex-row justify-between items-center align-middle border border-line p-2 mb-6 rounded-md bg-neutral text-sm text-primary">
      <div className="ml-4">
        This proposal is awaiting approval from a House of Stake reviewer
      </div>
      {isReviewer && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              loading={isApprovingProposal}
              disabled={isRejectingProposal}
              onClick={() => approveProposal(proposal.id)}
            >
              Approve
            </Button>
            <Button
              loading={isRejectingProposal}
              disabled={isApprovingProposal}
              variant="destructive"
              onClick={() => rejectProposal(proposal.id)}
            >
              Reject
            </Button>
          </div>
          {approveProposalError && (
            <div className="text-red-500">{approveProposalError.message}</div>
          )}
          {rejectProposalError && (
            <div className="text-red-500">{rejectProposalError.message}</div>
          )}
        </div>
      )}
    </div>
  );
};
