import Link from "next/link";

import NearProposalTimeStatus from "./NearProposalTimeStatus";
import NearProposalStatus from "./NearProposalStatus";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { NearProposalStatusText } from "./NearProposalStatusText";
import { Proposal } from "@/lib/api/proposal/types";
import { useProposal } from "@/hooks/useProposal";

export const NearProposal = memo(({ proposal }: { proposal: Proposal }) => {
  const { proposal: proposalInfo } = useProposal(
    proposal.proposalId.toString()
  );

  if (!proposalInfo) {
    return null;
  }

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
              <NearProposalStatusText proposal={proposalInfo} />
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
            <div className="text-xs text-secondary">
              <NearProposalTimeStatus proposal={proposalInfo} />
            </div>
            <NearProposalStatusText proposal={proposalInfo} />
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
