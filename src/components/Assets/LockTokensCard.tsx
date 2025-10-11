"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import LockClosedIcon from "@/assets/lock_closed.svg";

import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

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
        <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <Image
            src={LockClosedIcon}
            alt="coin"
            width={32}
            height={32}
            className="sm:w-9 sm:h-9 lg:w-10 lg:h-10"
          />
          <div className="text-black">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
              Lock Tokens
            </h3>
            <p className="text-sm sm:text-base lg:text-lg mb-4">
              Get boosted voting power!
            </p>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl sm:text-4xl lg:text-6xl font-bold">
                {apy}%
              </span>
            </div>
            <Link
              href="/info"
              className="flex items-center text-black font-medium hover:opacity-80 transition-opacity gap-2"
            >
              Learn More
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
);

LockTokensCard.displayName = "LockTokensCard";
