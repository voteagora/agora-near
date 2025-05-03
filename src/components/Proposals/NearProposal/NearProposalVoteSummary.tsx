"use client";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { useState } from "react";
import NearProposalStatusDetail from "./NearProposalStatusDetail";
import NearProposalVoteBar from "./NearProposalVoteBar";
import NearProposalPopover from "./NearProposalPopover";
import { getNearQuorum } from "@/lib/nearProposalUtils";

export default function NearProposalVoteSummary({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const quorum = getNearQuorum(proposal);

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
                <NearTokenAmount
                  amount={proposal.votes[0].total_venear}
                  hideCurrency
                />
              </div>
              <div className="text-negative">
                {proposal.voting_options[1]} -{" "}
                <NearTokenAmount
                  amount={proposal.votes[1].total_venear}
                  hideCurrency
                />
              </div>
            </div>
            <NearProposalVoteBar proposal={proposal} />
            <div className="text-secondary font-normal">
              Quorum <NearTokenAmount amount={quorum.toFixed()} hideCurrency />
            </div>
            <div>
              <NearProposalStatusDetail
                proposal={proposal}
                className="-mx-4 border-t border-line"
              />
            </div>
          </HoverCardTrigger>
        </div>
        <HoverCardContent
          className="pb-0 absolute w-auto mt-1"
          side="top"
          align={"start"}
        >
          <NearProposalPopover proposal={proposal} />
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}
