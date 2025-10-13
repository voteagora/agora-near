"use client";

import React from "react";
import TokenAmount from "@/components/shared/TokenAmount";
import { useTotalSupply } from "@/hooks/useTotalNearSupply";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GOAL_AMOUNT = "10000000000000000000000000000000"; // 10M veNEAR (with 24 decimals)
const GOAL_DATE = "December 1, 2025";

export const VeNearGoalBar = () => {
  const { votableSupply, isLoadingVotableSupply } = useTotalSupply();

  const currentAmount = votableSupply ? BigInt(votableSupply) : BigInt(0);
  const goalAmount = BigInt(GOAL_AMOUNT);

  const percentage =
    goalAmount > 0
      ? Math.min((Number(currentAmount) / Number(goalAmount)) * 100, 100)
      : 0;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border border-line p-6 mt-4 rounded-xl bg-neutral shadow-sm"
    >
      <AccordionItem className="border-none" value="item-1">
        <AccordionTrigger className="text-primary font-bold hover:no-underline p-0">
          veNEAR Supply Goal
        </AccordionTrigger>
        <AccordionContent className="pt-6 px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-secondary">
                Target: 10M veNEAR by {GOAL_DATE}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-3xl font-bold text-primary">
                {percentage.toFixed(1)}%
              </div>
              <div className="text-xs text-secondary">Complete</div>
            </div>
          </div>

          <div className="relative w-full h-8 bg-wash rounded-full overflow-hidden border border-line">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center mt-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-secondary font-medium">Current</span>
              <span className="text-primary font-bold">
                {isLoadingVotableSupply ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <TokenAmount
                    amount={votableSupply || "0"}
                    currency="veNEAR"
                  />
                )}
              </span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-secondary font-medium">Goal</span>
              <span className="text-primary font-bold">
                <TokenAmount amount={GOAL_AMOUNT} currency="veNEAR" />
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
