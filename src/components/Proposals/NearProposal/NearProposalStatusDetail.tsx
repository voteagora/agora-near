import {
  ProposalDisplayStatus,
  ProposalInfo,
} from "@/lib/contracts/types/voting";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getProposalStatus,
  getProposalStatusColor,
  getQuorumPercentage,
  isQuorumFulfilled,
} from "@/lib/nearProposalUtils";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import NearProposalTimeStatus from "../NearProposals/NearProposalTimeStatus";

export default function NearProposalStatusDetail({
  proposal,
  className,
}: {
  proposal: ProposalInfo;
  className?: string;
}) {
  const status = getProposalStatus(proposal);
  const isDefeated = status === ProposalDisplayStatus.Defeated;

  const { text, bg } = getProposalStatusColor(status);

  const quorumFulfilled = isQuorumFulfilled(proposal);

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
          {!quorumFulfilled && isDefeated && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={14} />
                </TooltipTrigger>
                <TooltipContent className="max-w-[400px]">
                  {`Even though quorum is not modeled onchain in House of Stake v1, the community has decided that
                  if ${getQuorumPercentage()}% of the voting power does not participate, the proposal will not be considered passed.`}{" "}
                  <a className="text-blue-500" href="">
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
