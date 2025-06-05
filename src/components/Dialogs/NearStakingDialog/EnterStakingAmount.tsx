import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { Input } from "@/components/ui/input";
import { NEAR_TOKEN_METADATA } from "@/lib/constants";
import Image from "next/image";
import { useStakingProviderContext } from "../StakingProvider";
import { StakingOptionCard } from "./StakingOptionCard";
import { StakingPool } from "@/lib/types";

type EnterStakingAmountProps = {
  onContinue: (selectedProvider: StakingPool) => void;
  onSkip: () => void;
};

export const EnterStakingAmount = ({
  onContinue,
  onSkip,
}: EnterStakingAmountProps) => {
  const {
    poolStats,
    pools,
    enteredAmount,
    setEnteredAmount,
    onStakeMax,
    maxStakingAmount,
    amountError,
    selectedPool,
    setSelectedPool,
  } = useStakingProviderContext();

  const handleContinue = () => {
    if (!enteredAmount || !!amountError) return;
    onContinue(selectedPool);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Stake assets and get liquid rewards
        </h1>
      </div>

      {/* Staking Provider Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {pools.map((pool) => (
          <StakingOptionCard
            key={pool.id}
            isSelected={selectedPool.id === pool.id}
            onSelect={() => setSelectedPool(pool)}
            tokenMetadata={pool.metadata}
            apy={poolStats[pool.id]?.apy}
            totalVolumeYocto={poolStats[pool.id]?.totalVolumeYocto ?? "-"}
          />
        ))}
      </div>
      <div className="mb-6">
        <div className="text-gray-500 text-sm mb-2">
          NEAR Available{" "}
          <NearTokenAmount amount={maxStakingAmount ?? "0"} hideCurrency />
        </div>

        {/* Amount Input */}
        <div className="relative">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Image
                src={NEAR_TOKEN_METADATA.icon}
                alt="NEAR"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-medium">NEAR</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onStakeMax}
                className="px-3 py-1 text-sm text-[#00E391] hover:bg-[#00E391] hover:text-white rounded transition-colors duration-200"
              >
                Max
              </button>
              <Input
                type="text"
                placeholder="0"
                value={enteredAmount}
                onChange={(e) => setEnteredAmount(e.target.value)}
                className="w-full bg-transparent border-none text-lg text-right p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-500 h-2">{amountError}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-4">
        <button
          onClick={handleContinue}
          disabled={!enteredAmount || !!amountError}
          className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-200"
        >
          Continue
        </button>

        <button
          onClick={onSkip}
          className="w-full text-gray-600 py-2 font-medium hover:text-gray-800 transition-colors duration-200"
        >
          Skip
        </button>
      </div>

      {/* Disclosure */}
      <div className="text-center text-xs text-gray-500">
        You may unstake your tokens at any time.{" "}
        <button className="underline text-black font-medium">
          Disclosures
        </button>
      </div>
    </div>
  );
};
