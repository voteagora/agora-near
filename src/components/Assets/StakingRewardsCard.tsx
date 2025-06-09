"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StakingRewardsCardProps {
  apy: string;
  className?: string;
}

export const StakingRewardsCard = memo(
  ({ apy, className }: StakingRewardsCardProps) => {
    return (
      <Card
        className={cn(
          "relative overflow-hidden border-0 shadow-lg bg-black text-white",
          className
        )}
      >
        <CardContent className="relative">
          <div className="relative text-center">
            <div className="flex flex-col py-8">
              <h3 className="text-2xl font-bold mb-2">Staking Rewards</h3>
              <p className="text-sm mb-4 text-white">
                Keep your tokens working!
              </p>
              <div className="flex flex-col">
                <span className="text-sm text-white">up to</span>
                <span className="text-6xl font-bold">{apy}%</span>
                <span className="text-sm text-white">APY</span>
              </div>
            </div>
            <div className="flex flex-row w-full justify-center">
              <div className="grid grid-cols-5 gap-4 ">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 text-current"
                    style={{ color: "#00E391" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

StakingRewardsCard.displayName = "StakingRewardsCard";
