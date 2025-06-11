"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import LockClosedIcon from "@/assets/icons/lock_closed.svg";

import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

interface LockTokensCardProps {
  apy: string;
  className?: string;
}

export const LockTokensCard = memo(
  ({ apy, className }: LockTokensCardProps) => {
    return (
      <Card
        className={cn(
          "relative flex h-full border border-black shadow-lg",
          className
        )}
        style={{ backgroundColor: "#00E391" }}
      >
        <CardContent className="p-6 flex flex-col gap-8">
          <Image src={LockClosedIcon} alt="coin" width={40} height={40} />
          <div className="text-black">
            <h3 className="text-2xl font-bold mb-2">Lock Tokens</h3>
            <p className="text-lg mb-4">Get boosted voting power!</p>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-6xl font-bold">{apy}%</span>
              <span className="text-lg">APY</span>
            </div>
            <button className="flex items-center text-black font-medium hover:opacity-80 transition-opacity gap-2">
              Learn More
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

LockTokensCard.displayName = "LockTokensCard";
