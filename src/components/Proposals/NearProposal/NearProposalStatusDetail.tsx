import { ProposalInfo } from "@/lib/contracts/types/voting";

import { cn } from "@/lib/utils";
import NearProposalTimeStatus from "../NearProposals/NearProposalTimeStatus";
import {
  getNearQuorum,
  getProposalStatus,
  getProposalStatusColor,
  isForGreaterThanAgainst,
  isQuorumFulfilled,
} from "@/lib/nearProposalUtils";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import Big from "big.js";

export default function NearProposalStatusDetail({
  proposal,
  className,
}: {
  proposal: ProposalInfo;
  className?: string;
}) {
  const status = getProposalStatus(proposal);

  const { text, bg } = getProposalStatusColor(status);

  const quorum = getNearQuorum(proposal);
  const quorumFulfilled = isQuorumFulfilled(proposal);
  const forGreaterThanAgainst = isForGreaterThanAgainst(proposal);

  return (
    <div
      className={cn(
        className,
        "flex flex-row justify-between items-center gap-4 bg-wash px-4 py-2 text-secondary rounded-b-md text-xs"
      )}
    >
      <div>
        <p
          className={cn(
            text,
            bg,
            "flex items-center gap-2 rounded-sm px-1 py-0.5 font-semibold"
          )}
        >
          {status.toUpperCase()}
          {!quorumFulfilled && forGreaterThanAgainst && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={14} />
                </TooltipTrigger>
                <TooltipContent className="max-w-[400px]">
                  Even though in House of Stake v1, quorum is not modeled
                  onchain, the community has decided that if 30% of the voting
                  power (<NearTokenAmount amount={Big(quorum).toString()} />)
                  don&apos;t vote, the proposal will not be considered passed.{" "}
                  <a href="https://docs.near.org/integrations/faq">
                    Learn more here
                  </a>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </p>
      </div>
      <div className="font-normal">
        <NearProposalTimeStatus proposal={proposal} />
      </div>
    </div>
  );
}
