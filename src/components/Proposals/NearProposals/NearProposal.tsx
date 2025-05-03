import Link from "next/link";

import { VStack } from "@/components/Layout/Stack";
import NearProposalTimeStatus from "./NearProposalTimeStatus";
import NearProposalStatus from "./NearProposalStatus";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { NearProposalStatusText } from "./NearProposalStatusText";

export const NearProposal = memo(({ proposal }: { proposal: ProposalInfo }) => {
  return (
    <Link
      key={`${proposal.id}-${proposal.status}`}
      href={`/proposals/${proposal.id}`}
    >
      <div className="border-b border-line items-center flex flex-row bg-neutral">
        <div
          className={cn(
            "flex flex-col whitespace-nowrap overflow-ellipsis overflow-hidden py-4 px-6",
            "w-full sm:w-[55%] items-start justify-center"
          )}
        >
          <div className="flex flex-row text-xs text-secondary gap-1">
            <div className="hidden sm:inline">
              Proposal by {proposal.proposer_id}
            </div>
            <div className="block sm:hidden">
              <NearProposalStatusText proposal={proposal} />
            </div>
          </div>
          <div className="overflow-ellipsis overflow-visible whitespace-normal break-words text-primary">
            {(proposal.title ?? "").length > 80
              ? `${proposal.title?.slice(0, 80)}...`
              : proposal.title}
          </div>
        </div>
        <div className="flex-col whitespace-nowrap overflow-ellipsis overflow-hidden py-4 px-6 w-[20%] flex-start justify-center hidden sm:block">
          <div className="flex flex-col items-end">
            <div className="text-xs text-secondary">
              <NearProposalTimeStatus proposal={proposal} />
            </div>
            <NearProposalStatusText proposal={proposal} />
          </div>
        </div>
        <div className="flex-col whitespace-nowrap overflow-ellipsis overflow-hidden py-4 px-6 w-[25%] flex-start justify-center hidden sm:block">
          <div className="overflow-hidden overflow-ellipsis">
            {proposal.voting_options.length !== 2 && (
              <VStack className="text-right">
                <p>{proposal.voting_options.length} Choices</p>
              </VStack>
            )}
            {proposal.voting_options.length === 2 && (
              <NearProposalStatus proposal={proposal} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

NearProposal.displayName = "NearProposal";
