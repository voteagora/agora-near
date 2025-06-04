import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { useStakingProviderContext } from "../StakingProvider";
import { useNearPrice } from "@/hooks/useNearPrice";
import { useCallback, useMemo } from "react";
import { yoctoNearToUsdFormatted } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useStakeNear } from "@/hooks/useStakeNear";
import { UpdatedButton } from "@/components/Button";

type StakingReviewProps = {
  onBack: () => void;
};

export const StakingReview = ({ onBack }: StakingReviewProps) => {
  const {
    poolStats,
    amountInStakingToken,
    selectedPool,
    enteredAmountYoctoNear,
    lockupAccountId,
  } = useStakingProviderContext();

  const { price, isLoading: isLoadingNearPrice } = useNearPrice();

  const selectedStats = poolStats[selectedPool.id];
  const selectedTokenMetadata = selectedPool.metadata;

  const totalUsd = useMemo(
    () =>
      yoctoNearToUsdFormatted(enteredAmountYoctoNear, price?.toString() ?? "0"),
    [enteredAmountYoctoNear, price]
  );

  const { stakeNear, isStakingNear } = useStakeNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const onStake = useCallback(() => {
    stakeNear(enteredAmountYoctoNear);
  }, [enteredAmountYoctoNear, stakeNear]);

  return (
    <div className="p-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="text-sm text-primary font-medium hover:underline"
      >
        Edit
      </button>

      {/* Amount Staking Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900 mb-1">
              Amount staking
            </h2>
            <div className="text-sm text-gray-500">
              {`${selectedStats?.apy?.toFixed(2) ?? "-"}% APY`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-md font-bold text-gray-900 mb-1">
              <NearTokenAmount amount={enteredAmountYoctoNear} />
            </div>
            <div className="text-sm text-gray-500">
              <NearTokenAmount
                amount={amountInStakingToken}
                currency={selectedTokenMetadata.symbol}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-12 flex flex-col items-end">
        <div className="text-sm text-gray-500">Total</div>
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-gray-900">
            <NearTokenAmount
              amount={enteredAmountYoctoNear}
              hideCurrency={true}
            />
          </div>
          {isLoadingNearPrice ? (
            <Skeleton className="w-16 h-4" />
          ) : (
            <div className="text-lg text-gray-500">{totalUsd}</div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <UpdatedButton isLoading={isStakingNear} onClick={onStake}>
          Stake Tokens
        </UpdatedButton>
        <div className="text-center text-sm text-gray-500">
          You may unlock your tokens at any time.{" "}
          <button className="underline text-black font-medium">
            Disclosures
          </button>
        </div>
      </div>
    </div>
  );
};
