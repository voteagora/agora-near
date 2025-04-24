import { cn } from "@/lib/utils";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import TokenAmountDecorated from "@/components/shared/TokenAmountDecorated";
import { HStack } from "@/components/Layout/Stack";
import { motion } from "framer-motion";
import { VStack } from "@/components/Layout/Stack";
import { useState } from "react";
import { useTransition } from "react";

export default function NearProposalOptionsResult({
  proposal,
  className,
}: {
  proposal: ProposalInfo;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handleTabsChange(index: number) {
    startTransition(() => {
      setActiveTab(index);
    });
  }

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
              <div
                className={cn(
                  "flex flex-col max-h-[calc(100vh-482px)] overflow-y-scroll flex-shrink px-4",
                  className
                )}
              >
                {proposal.voting_options.map((option, index) => (
                  <SingleOption
                    key={index}
                    description={option}
                    votes={Number(proposal.votes[index].total_venear)}
                    totalVotes={Number(proposal.total_votes.total_venear)}
                  />
                ))}
              </div>
            ) : (
              <div />
            )}
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
}: {
  description: string;
  votes: number;
  totalVotes: number;
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
          <TokenAmountDecorated
            amount={votes.toString()}
            hideCurrency
            specialFormatting
          />
          <span className={cn("ml-1 text-tertiary")}>
            {percentage === 0 ? "0%" : percentage.toFixed(2) + "%"}
          </span>
        </div>
      </div>
      <ProgressBar percentage={percentage} isApproved={false} />
    </div>
  );
}

export function ProgressBar({
  percentage,
  isApproved,
}: {
  percentage: number;
  isApproved: boolean;
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
      </div>
    </div>
  );
}
