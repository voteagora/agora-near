import { ArrowRightIcon } from "lucide-react";
import { memo } from "react";
import Link from "next/link";
import { AnimatedStars } from "./AnimatedStars";

export const GovernanceRewardsCard = memo(() => {
  return (
    <div className="flex-1 bg-black rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10 flex">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-lg font-semibold">Governance Rewards</div>
          </div>
          <div className="text-sm text-gray-300 mb-4">
            Coming soon! NEAR is rewarding veNEAR holders with liquid NEAR
            rewards.
          </div>
          <Link
            href="/info?item=rewards-distribution"
            className="text-sm text-white hover:text-gray-200 flex items-center gap-1"
          >
            Learn more <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <AnimatedStars />
      </div>
    </div>
  );
});

GovernanceRewardsCard.displayName = "GovernanceRewardsCard";
