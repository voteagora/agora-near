import { ArrowRightIcon } from "lucide-react";
import { memo } from "react";
import GreenStar from "@/assets/green_star.svg";
import Image from "next/image";

export const GovernanceRewardsCard = memo(() => {
  return (
    <div className="flex-1 bg-black rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10 flex">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-lg font-semibold">Governance Rewards</div>
          </div>
          <div className="text-sm text-gray-300 mb-4">
            NEAR is rewarding veToken holders with liquid NEAR rewards
          </div>
          <button className="text-sm text-white hover:text-gray-200 flex items-center gap-1">
            Learn more <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col justify-center gap-4 ml-8">
          <Image src={GreenStar} alt="" className="w-6 h-6" />
          <Image src={GreenStar} alt="" className="w-6 h-6" />
          <Image src={GreenStar} alt="" className="w-6 h-6" />
          <Image src={GreenStar} alt="" className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
});

GovernanceRewardsCard.displayName = "GovernanceRewardsCard";
