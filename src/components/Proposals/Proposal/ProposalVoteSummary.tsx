"use client";
import TokenAmount from "@/components/shared/TokenAmount";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { getVenearForQuorum } from "@/lib/proposalUtils";
import { useState } from "react";
import ProposalPopover from "./ProposalPopover";
import ProposalStatusDetail from "./ProposalStatusDetail";
import ProposalVoteBar from "./ProposalVoteBar";

export default function ProposalVoteSummary({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const quorum = getVenearForQuorum(proposal);

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
                {proposal.voting_options[0]} -{" "}
                <TokenAmount
                  amount={proposal.votes[0].total_venear}
                  hideCurrency
                />
              </div>
              <div className="text-negative">
                {proposal.voting_options[1]} -{" "}
                <TokenAmount
                  amount={proposal.votes[1].total_venear}
                  hideCurrency
                />
              </div>
            </div>
            <ProposalVoteBar proposal={proposal} />
            <div className="text-secondary font-normal pb-2">
              Quorum <TokenAmount amount={quorum.toFixed(0)} hideCurrency />
            </div>
          </HoverCardTrigger>
          <div className="cursor-pointer flex flex-col gap-2 px-4">
            <ProposalStatusDetail
              proposal={proposal}
              className="-mx-4 border-t border-line"
            />
          </div>
        </div>
        <HoverCardContent
          className="pb-0 absolute w-auto mt-1"
          side="top"
          align={"start"}
        >
          <ProposalPopover proposal={proposal} />
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}
