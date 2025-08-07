import { UpdatedButton } from "@/components/Button";
import TokenAmount from "@/components/shared/TokenAmount";
import { Input } from "@/components/ui/input";
import { NEAR_TOKEN, NEAR_TOKEN_METADATA } from "@/lib/constants";
import { StakingPool } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Big from "big.js";
import Image from "next/image";
import { useCallback } from "react";
import { useStakingProviderContext } from "../StakingProvider";
import { StakingDialogHeader } from "./StakingDialogHeader";
import { StakingOptionCard } from "./StakingOptionCard";

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
    source,
    hasAlreadySelectedStakingPool,
    isStakingMax,
  } = useStakingProviderContext();

  const handleContinue = useCallback(() => {
    if (!enteredAmount || !!amountError) return;
    onContinue(selectedPool);
  }, [enteredAmount, amountError, onContinue, selectedPool]);

  return (
    <div className="flex-1 flex flex-col gap-2">
      <StakingDialogHeader />
      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Stake assets and get liquid rewards
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {pools.map((pool) => (
            <StakingOptionCard
              key={pool.id}
              isEnabled={!hasAlreadySelectedStakingPool}
              isSelected={selectedPool.id === pool.id}
              onSelect={() => setSelectedPool(pool)}
              tokenMetadata={pool.metadata}
              apy={poolStats[pool.id]?.apy}
              totalVolumeYocto={poolStats[pool.id]?.totalVolumeYocto ?? "-"}
            />
          ))}
        </div>
        <div className="mb-6">
          <div className="text-base text-[#9D9FA1] mb-2">
            NEAR Available{" "}
            <TokenAmount amount={maxStakingAmount ?? "0"} hideCurrency />
          </div>

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

              <div className="flex items-center ml-2">
                <Input
                  type="text"
                  placeholder="0"
                  value={
                    // Override value for display purposes when staking max
                    isStakingMax
                      ? formatNumber(
                          maxStakingAmount ?? "0",
                          NEAR_TOKEN.decimals
                        )
                      : enteredAmount
                  }
                  onChange={(e) => setEnteredAmount(e.target.value)}
                  className="w-full bg-transparent border-none text-lg text-right h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  onClick={onStakeMax}
                  disabled={!maxStakingAmount || Big(maxStakingAmount).lte(0)}
                  className="px-3 py-1 text-sm text-[#00E391] hover:bg-[#00E391] hover:text-white rounded transition-colors duration-200"
                >
                  Max
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-red-500 h-2">{amountError}</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end gap-2 mb-4">
          <UpdatedButton
            onClick={handleContinue}
            disabled={!enteredAmount || !!amountError}
            variant="rounded"
          >
            Continue
          </UpdatedButton>

          {source === "onboarding" && <button onClick={onSkip}>Skip</button>}
        </div>
      </div>
    </div>
  );
};
