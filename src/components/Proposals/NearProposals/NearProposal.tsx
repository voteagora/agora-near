import Link from "next/link";

import NearProposalTimeStatus from "./NearProposalTimeStatus";
import NearProposalStatus from "./NearProposalStatus";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { NearProposalStatusText } from "./NearProposalStatusText";
import { Proposal } from "@/lib/api/proposal/types";
import { useProposal } from "@/hooks/useProposal";
import { Skeleton } from "@/components/ui/skeleton";

export const NearProposal = memo(({ proposal }: { proposal: Proposal }) => {
  // TODO: Currently our BE is missing some data for proposals, requiring us to fetch the remaining data
  // from the contract. This is a stopgap solution that will be removed when AXB-167 lands.
  const { proposal: proposalInfo, isLoading: isLoadingProposalFromContract } =
    useProposal(proposal.proposalId.toString());

  return (
    <Link key={proposal.id} href={`/proposals/${proposal.proposalId}`}>
      <div className="border-b border-line items-center flex flex-row bg-neutral">
        <div
          className={cn(
            "flex flex-col whitespace-nowrap overflow-ellipsis overflow-hidden py-4 px-6",
            "w-full items-start justify-center"
          )}
        >
          <div className="flex flex-row text-xs text-secondary gap-1">
            <div className="hidden sm:inline">
              Proposal by {proposal.creatorId}
            </div>
            <div className="block sm:hidden">
              {isLoadingProposalFromContract || !proposalInfo ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                <NearProposalStatusText proposal={proposalInfo} />
              )}
            </div>
          </div>
          <div className="overflow-ellipsis overflow-visible whitespace-normal break-words text-primary">
            {(proposal.proposalTitle ?? "").length > 80
              ? `${proposal.proposalTitle?.slice(0, 80)}...`
              : proposal.proposalTitle}
          </div>
        </div>
        <div className="flex-col whitespace-nowrap overflow-visible py-4 px-6 w-fit flex-start justify-center hidden sm:block">
          <div className="flex flex-col items-end">
            {isLoadingProposalFromContract || !proposalInfo ? (
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="w-[120px] h-4" />
                <Skeleton className="w-[90px] h-4" />
              </div>
            ) : (
              <>
                <div className="text-xs text-secondary">
                  <NearProposalTimeStatus proposal={proposalInfo} />
                </div>
                <NearProposalStatusText proposal={proposalInfo} />
              </>
            )}
          </div>
        </div>
        <div className="flex-col whitespace-nowrap overflow-visible py-4 px-6 w-fit flex-start justify-center hidden lg:block">
          <div className="overflow-hidden overflow-ellipsis">
            <NearProposalStatus proposal={proposal} />
          </div>
        </div>
      </div>
    </Link>
  );
});

NearProposal.displayName = "NearProposal";
