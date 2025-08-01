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
} from "@/lib/proposalUtils";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import ProposalTimeStatus from "../Proposals/ProposalTimeStatus";

export default function ProposalStatusDetail({
  proposal,
  className,
}: {
  proposal: ProposalInfo;
  className?: string;
}) {
  const status = getProposalStatus({
    status: proposal.status,
    totalVotingPower: proposal.snapshot_and_state?.total_venear ?? "0",
    forVotingPower: proposal.votes[0].total_venear,
    againstVotingPower: proposal.votes[1].total_venear,
  });
  const isDefeated = status === ProposalDisplayStatus.Defeated;

  const { text, bg } = getProposalStatusColor(status);

  const quorumFulfilled = isQuorumFulfilled({
    totalVotingPower: proposal.snapshot_and_state?.total_venear ?? "0",
    forVotingPower: proposal.votes[0].total_venear,
    againstVotingPower: proposal.votes[1].total_venear,
  });

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
                  proposals must meet a minimum quorum requirement to be considered passed. The quorum is calculated as 
                  the higher of either ${getQuorumPercentage()}% of total veNEAR supply or an absolute floor of 7M veNEAR.`}{" "}
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
        <ProposalTimeStatus
          votingDurationNs={proposal.voting_duration_ns}
          votingStartTimeNs={proposal.voting_start_time_ns ?? ""}
          votingCreationTimeNs={proposal.creation_time_ns ?? ""}
          status={proposal.status}
        />
      </div>
    </div>
  );
}
