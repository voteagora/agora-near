import { UpdatedButton } from "@/components/Button";
import TokenAmount from "@/components/shared/TokenAmount";
import { TransactionError } from "@/components/TransactionError";
import { Skeleton } from "@/components/ui/skeleton";
import { useNear } from "@/contexts/NearContext";
import { usePrice } from "@/hooks/usePrice";
import { useSelectStakingPool } from "@/hooks/useSelectStakingPool";
import { useStakeNear } from "@/hooks/useStakeNear";
import { yoctoNearToUsdFormatted } from "@/lib/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { useStakingProviderContext } from "../StakingProvider";
import { StakingSubmitting } from "./StakingSubmitting";
import { StakingSuccess } from "./StakingSuccess";
import { StakingDisclosures } from "./StakingDisclosures";

export type StakingStep = "select_pool" | "stake";

type StakingReviewProps = {
  onBack: () => void;
  handleViewDashboard: () => void;
};

export const StakingReview = ({
  onBack,
  handleViewDashboard,
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

  const [stakingStep, setStakingStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisclosures, setShowDisclosures] = useState(false);

  const { networkId } = useNear();

  const { price, isLoading: isLoadingNearPrice } = usePrice();
  const [isStakeCompleted, setIsStakeCompleted] = useState(false);

  const selectedStats = poolStats[selectedPool.id];
  const selectedTokenMetadata = selectedPool.metadata;

  const needsToSelectPool = useMemo(() => {
    const desiredPoolId = selectedPool.contracts[networkId];
    return !currentStakingPoolId || currentStakingPoolId !== desiredPoolId;
  }, [currentStakingPoolId, selectedPool.contracts, networkId]);

  const totalUsd = useMemo(() => {
    if (!price || !enteredAmountYoctoNear) return "0";
    return yoctoNearToUsdFormatted(enteredAmountYoctoNear, String(price));
  }, [enteredAmountYoctoNear, price]);

  const { stakeNear, isStakingNear, stakingNearError } = useStakeNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { selectStakingPoolAsync, error: selectStakingPoolError } =
    useSelectStakingPool({
      lockupAccountId: lockupAccountId ?? "",
    });

  const stakeError = useMemo(() => {
    if (stakingNearError) {
      return "Something went wrong staking your funds.";
    }
    if (selectStakingPoolError) {
      return "Something went wrong selecting a staking pool.";
    }
    return null;
  }, [stakingNearError, selectStakingPoolError]);

  const requiredSteps = useMemo(() => {
    const steps: StakingStep[] = [];
    if (needsToSelectPool) {
      steps.push("select_pool");
    }
    steps.push("stake");
    return steps;
  }, [needsToSelectPool]);

  const onStake = useCallback(
    async ({ startAtStep = 0 }: { startAtStep?: number }) => {
      try {
        setIsSubmitting(true);

        for (let i = startAtStep; i < requiredSteps.length; i++) {
          const step = requiredSteps[i];
          setStakingStep(i);

          if (step === "select_pool") {
            await selectStakingPoolAsync({
              stakingPoolId: selectedPool.contracts[networkId],
            });
          } else if (step === "stake") {
            await stakeNear(enteredAmountYoctoNear);
          }
        }

        setIsStakeCompleted(true);
      } catch (e) {
        console.error(`Staking error: ${e}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      enteredAmountYoctoNear,
      networkId,
      requiredSteps,
      selectStakingPoolAsync,
      selectedPool.contracts,
      stakeNear,
    ]
  );

  const onRetryFromCurrentStep = useCallback(() => {
    onStake({ startAtStep: stakingStep });
  }, [onStake, stakingStep]);

  const handleStakeMoreFunds = useCallback(() => {
    resetForm();
    onBack();
  }, [resetForm, onBack]);

  const handleShowDisclosures = useCallback(() => {
    setShowDisclosures(true);
  }, []);

  const handleBackFromDisclosures = useCallback(() => {
    setShowDisclosures(false);
  }, []);

  if (showDisclosures) {
    return <StakingDisclosures onBack={handleBackFromDisclosures} />;
  }

  if (isSubmitting) {
    return (
      <StakingSubmitting
        requiredSteps={requiredSteps}
        currentStep={stakingStep}
      />
    );
  }

  if (isStakeCompleted && !stakeError) {
    return (
      <StakingSuccess
        onStakeMore={handleStakeMoreFunds}
        onViewDashboard={handleViewDashboard}
      />
    );
  }

  if (stakeError) {
    return (
      <TransactionError
        message={stakeError}
        onRetry={onRetryFromCurrentStep}
        onGoBack={onBack}
      />
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-12">
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
            <h2 className="text-md font-semibold mb-1">Amount staking</h2>
            <div className="text-sm text-[#9D9FA1]">
              {`${selectedStats?.apy?.toFixed(2) ?? "-"}% APY`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-md font-bold text-gray-900 mb-1">
              <TokenAmount amount={enteredAmountYoctoNear} />
            </div>
            {isLoadingNearPrice ? (
              <Skeleton className="w-16 h-4" />
            ) : (
              <div className="text-sm text-[#9D9FA1]">{totalUsd}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-[#9D9FA1]">Total</div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-gray-900">
              <TokenAmount
                amount={amountInStakingToken}
                currency={selectedTokenMetadata.symbol}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-4">
        <UpdatedButton
          isLoading={isStakingNear}
          onClick={onStake}
          variant="rounded"
        >
          {stakingNearError ? "Failed to stake - try again" : "Stake tokens"}
        </UpdatedButton>
        <div className="text-center text-xs text-[#9D9FA1]">
          You may unstake your tokens at any time.{" "}
          <button
            onClick={handleShowDisclosures}
            className="underline text-black font-medium"
          >
            Disclosures
          </button>
        </div>
      </div>
    </div>
  );
};
