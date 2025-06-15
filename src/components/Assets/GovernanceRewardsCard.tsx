import { ArrowRightIcon } from "lucide-react";
import { memo } from "react";

export const GovernanceRewardsCard = memo(() => {
  return (
    <div className="flex-1 bg-black rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-lg font-semibold">Governance Rewards</div>
          <div className="text-green-400">✦</div>
        </div>
        <div className="text-sm text-gray-300 mb-4">
          NEAR is rewarding veToken holders with liquid NEAR rewards
        </div>
        <button className="text-sm text-white hover:text-gray-200 flex items-center gap-1">
          Learn more <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-green-400 text-xl">✦</div>
      <div className="absolute top-12 right-8 text-green-400 text-lg">✦</div>
      <div className="absolute bottom-8 right-6 text-green-400 text-xl">✦</div>
      <div className="absolute bottom-4 right-12 text-green-400 text-lg">✦</div>
    </div>
  );
});

GovernanceRewardsCard.displayName = "GovernanceRewardsCard";
