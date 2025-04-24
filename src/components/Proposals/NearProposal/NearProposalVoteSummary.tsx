"use client";
import { useState } from "react";
import {
  HoverCard,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import NearProposalStatusDetail from "./NearProposalStatusDetail";
import TokenAmountDecorated from "@/components/shared/TokenAmountDecorated";
import NearProposalVoteBar from "./NearProposalVoteBar";

export default function NearProposalVoteSummary({ proposal }: {
  proposal: ProposalInfo
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <HoverCard
      open={showDetails}
      onOpenChange={setShowDetails}
      openDelay={0}
      closeDelay={0}
    >
      <div style={{ position: "relative" }}>
        <div className="flex flex-col rounded-md font-bold shrink-0 text-xs border border-line mx-4 shadow-newDefault">
          <HoverCardTrigger className="w-full cursor-pointer flex flex-col gap-2 px-4 pt-2">
          <div className="flex flex-row justify-between mt-2">
              <div className="text-positive">
                FOR -{" "}
                {proposal.votes[0].total_venear === '0' ? 0 : (
                  <TokenAmountDecorated
                    amount={proposal.votes[0].total_venear}
                    hideCurrency
                    specialFormatting
                  />
                )}
              </div>
              <div className="text-negative">
                AGAINST -{" "}
                {proposal.votes[1].total_venear === '0' ? 0 : (
                  <TokenAmountDecorated
                    amount={proposal.votes[1].total_venear}
                    hideCurrency
                    specialFormatting
                  />
                )}
              </div>
            </div>
            <NearProposalVoteBar proposal={proposal} />
            <NearProposalStatusDetail
              proposal={proposal}
            />
          </HoverCardTrigger>
        </div>
      </div>
    </HoverCard>
  );
}
