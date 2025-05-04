import { HStack, VStack } from "@/components/Layout/Stack";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { VOTING_THRESHOLDS } from "@/lib/constants";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { votingOptionsToVoteStats } from "@/lib/nearProposalUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo, useState, useTransition } from "react";
import NearProposalStatusDetail from "./NearProposalStatusDetail";
import NearProposalVotingActions from "./NearProposalVotingActions";

export default function NearProposalOptionsResult({
  proposal,
  config,
  className,
}: {
  proposal: ProposalInfo;
  config: VotingConfig;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handleTabsChange(index: number) {
    startTransition(() => {
      setActiveTab(index);
    });
  }

  const optionsToStats = useMemo(() => {
    return votingOptionsToVoteStats(proposal);
  }, [proposal]);

  const sortedVotingOptions = useMemo(() => {
    return [...proposal.voting_options].sort((a, b) => {
      const diff =
        BigInt(optionsToStats[b].total_venear) -
        BigInt(optionsToStats[a].total_venear);

      return diff > 0 ? 1 : -1;
    });
  }, [proposal.voting_options, optionsToStats]);

  return (
    <div className="flex flex-col gap-4 sticky top-20 flex-shrink max-w-[24rem] bg-neutral border-line border rounded-xl shadow-newDefault mb-8 items-stretch sm:items-start justify-end sm:justify-between w-full max-h-none h-auto">
      <div className="flex flex-col gap-4 w-full">
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPending ? 0.3 : 1 }}
          transition={{ duration: 0.3, delay: isPending ? 0.3 : 0 }}
        >
          <VStack gap={1} className="relative min-h-0 h-full">
            <HStack className="h-12 pt-4 px-4 mb-1">
              {["Results", "Votes"].map((tab, index) => (
                <div
                  key={index}
                  onClick={() => handleTabsChange(index + 1)}
                  className="text-base font-semibold pr-4 cursor-pointer"
                >
                  <span
                    className={
                      activeTab === index + 1
                        ? "text-secondary"
                        : "text-tertiary"
                    }
                  >
                    {tab}
                  </span>
                </div>
              ))}
            </HStack>
            {activeTab === 1 ? (
              <div>
                <div
                  className={cn(
                    "flex flex-col max-h-[calc(100vh-482px)] overflow-y-scroll border-b border-line flex-shrink px-4",
                    className
                  )}
                >
                  {sortedVotingOptions.map((option, index) => (
                    <SingleOption
                      key={index}
                      description={option}
                      votes={Number(optionsToStats[option].total_venear)}
                      totalVotes={Number(proposal.total_votes.total_venear)}
                      thresholdPosition={VOTING_THRESHOLDS.SIMPLE_MAJORITY} // Assume simple majority for now
                    />
                  ))}
                </div>
                <div className="px-4 m-4 border border-line rounded-md">
                  <NearProposalStatusDetail
                    proposal={proposal}
                    className="-mx-4"
                  />
                </div>
              </div>
            ) : (
              <div />
            )}
            <NearProposalVotingActions proposal={proposal} config={config} />
          </VStack>
        </motion.div>
      </div>
    </div>
  );
}

function SingleOption({
  description,
  votes,
  totalVotes,
  thresholdPosition,
}: {
  description: string;
  votes: number;
  totalVotes: number;
  thresholdPosition: number;
}) {
  const percentage = totalVotes ? (votes / totalVotes) * 100 : 0;

  return (
    <div className="flex flex-col gap-1 last:mb-2">
      {" "}
      <div className="flex justify-between font-semibold text-sm mb-1">
        <div className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[12rem] text-primary">
          {description}
        </div>
        <div className="text-primary flex items-center gap-1">
          <NearTokenAmount amount={votes.toString()} hideCurrency />
          <span className={cn("ml-1 text-tertiary")}>
            {percentage === 0 ? "0%" : percentage.toFixed(2) + "%"}
          </span>
        </div>
      </div>
      <ProgressBar
        percentage={percentage}
        isApproved={percentage >= thresholdPosition}
        thresholdPosition={thresholdPosition}
      />
    </div>
  );
}

export function ProgressBar({
  percentage,
  isApproved,
  thresholdPosition,
}: {
  percentage: number;
  isApproved: boolean;
  thresholdPosition: number;
}) {
  const progressBarColor = isApproved ? "bg-positive" : "bg-tertiary";

  return (
    <div className="flex">
      {" "}
      <div className="w-full h-[6px] rounded-[10px] bg-line relative mb-3">
        <div
          className={`h-[6px] absolute rounded-[10px] top-0 right-0 ${progressBarColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
        {!!thresholdPosition && (
          <div
            className={`w-[2px] h-[6px] absolute top-0 rounded-[10px] bg-secondary`}
            style={{ right: `${thresholdPosition}%` }}
          ></div>
        )}
      </div>
    </div>
  );
}
