import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { useStakingProviderContext } from "../StakingProvider";
import { useNearPrice } from "@/hooks/useNearPrice";
import { useCallback, useMemo, useState } from "react";
import { yoctoNearToUsdFormatted } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useStakeNear } from "@/hooks/useStakeNear";
import { UpdatedButton } from "@/components/Button";
import { StakingSubmitting } from "./StakingSubmitting";
import { StakingSuccess } from "./StakingSuccess";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelectStakingPool } from "@/hooks/useSelectStakingPool";
import { useNear } from "@/contexts/NearContext";

export type StakingStep = "select_pool" | "stake";

type StakingReviewProps = {
  onBack: () => void;
  onCloseDialog: () => void;
};

export const StakingReview = ({
  onBack,
  onCloseDialog,
}: StakingReviewProps) => {
  const {
    poolStats,
    amountInStakingToken,
    selectedPool,
    enteredAmountYoctoNear,
    lockupAccountId,
    resetForm,
    currentStakingPoolId,
  } = useStakingProviderContext();

  const [stakingStep, setStakingStep] = useState<StakingStep>();

  const router = useRouter();

  const { networkId } = useNear();

  const { price, isLoading: isLoadingNearPrice } = useNearPrice();
  const [isStakeCompleted, setIsStakeCompleted] = useState(false);

  const selectedStats = poolStats[selectedPool.id];
  const selectedTokenMetadata = selectedPool.metadata;

  const totalUsd = useMemo(
    () =>
      yoctoNearToUsdFormatted(enteredAmountYoctoNear, price?.toString() ?? "0"),
    [enteredAmountYoctoNear, price]
  );

  const { stakeNear, isStakingNear, stakingNearError } = useStakeNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { selectStakingPoolAsync } = useSelectStakingPool({
    lockupAccountId: lockupAccountId ?? "",
  });

  const onStake = useCallback(async () => {
    try {
      if (!currentStakingPoolId) {
        setStakingStep("select_pool");
        await selectStakingPoolAsync({
          stakingPoolId: selectedPool.contracts[networkId],
        });
      }
      setStakingStep("stake");
      await stakeNear(enteredAmountYoctoNear);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsStakeCompleted(true);
    }
  }, [
    currentStakingPoolId,
    enteredAmountYoctoNear,
    networkId,
    selectStakingPoolAsync,
    selectedPool.contracts,
    stakeNear,
  ]);

  const handleStakeMoreFunds = useCallback(() => {
    resetForm();
    onBack();
  }, [resetForm, onBack]);

  const handleViewDashboard = useCallback(() => {
    onCloseDialog();
    router.push("/assets");
  }, [onCloseDialog, router]);

  if (isStakingNear && stakingStep) {
    return <StakingSubmitting stakingStep={stakingStep} />;
  }

  if (isStakeCompleted && !stakingNearError) {
    return (
      <StakingSuccess
        onStakeMore={handleStakeMoreFunds}
        onViewDashboard={handleViewDashboard}
      />
    );
  }

  return (
    <div className="flex flex-col h-full gap-12">
      <div>
        <button
          onClick={onBack}
          className="text-sm text-primary font-medium hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
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
            {isLoadingNearPrice ? (
              <Skeleton className="w-16 h-4" />
            ) : (
              <div className="text-sm text-gray-500">{totalUsd}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500">Total</div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-gray-900">
              <NearTokenAmount
                amount={amountInStakingToken}
                currency={selectedTokenMetadata.symbol}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-2">
        <UpdatedButton
          isLoading={isStakingNear}
          onClick={onStake}
          variant="rounded"
        >
          {stakingNearError ? "Failed to stake - try again" : "Stake tokens"}
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
