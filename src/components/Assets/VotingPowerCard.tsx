import { memo } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import NearTokenAmount from "../shared/NearTokenAmount";
import { TrendingUp } from "lucide-react";

type VotingPowerCardProps = {
  votingPower?: string;
};

export const VotingPowerCard = memo(({ votingPower }: VotingPowerCardProps) => {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex flex-col">
        <div className="text-sm text-gray-600 mb-2">Voting Power veNEAR</div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-light text-gray-900">
            <NearTokenAmount
              amount={votingPower ?? "0"}
              hideCurrency={true}
              minimumFractionDigits={4}
            />
          </span>
          <button className="flex items-center gap-1 text-sm">
            View Projections
            <TrendingUp />
          </button>
        </div>
      </div>
    </div>
  );
});

VotingPowerCard.displayName = "VotingPowerCard";
