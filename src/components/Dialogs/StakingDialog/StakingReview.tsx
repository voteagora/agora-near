import { UpdatedButton } from "@/components/Button";
import TokenAmount from "@/components/shared/TokenAmount";
import { TransactionError } from "@/components/TransactionError";
import { Skeleton } from "@/components/ui/skeleton";
import { useNear } from "@/contexts/NearContext";
import { usePrice } from "@/hooks/usePrice";
import { useSelectStakingPool } from "@/hooks/useSelectStakingPool";
import { useStakeNear } from "@/hooks/useStakeNear";
import { useLockNear } from "@/hooks/useLockNear";
import { useRefreshStakingPoolBalance } from "@/hooks/useRefreshStakingPoolBalance";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { yoctoNearToUsdFormatted } from "@/lib/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { useStakingProviderContext } from "../StakingProvider";
import { StakingSubmitting } from "./StakingSubmitting";
import { StakingSuccess } from "./StakingSuccess";
import { StakingDisclosures } from "./StakingDisclosures";
import Big from "big.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

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
    maxStakingAmount,
  } = useStakingProviderContext();

  const [stakingStep, setStakingStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisclosures, setShowDisclosures] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const needsToSelectPool = useMemo(
    () =>
      !currentStakingPoolId || currentStakingPoolId !== selectedPool.contract,
    [currentStakingPoolId, selectedPool.contract]
  );

  const { price, isLoading: isLoadingNearPrice } = usePrice();
  const [isStakeCompleted, setIsStakeCompleted] = useState(false);

  const selectedStats = poolStats[selectedPool.id];
  const selectedTokenMetadata = selectedPool.metadata;

  const totalUsd = useMemo(() => {
    if (!price || !enteredAmountYoctoNear) return "0";
    return yoctoNearToUsdFormatted(enteredAmountYoctoNear, String(price));
  }, [enteredAmountYoctoNear, price]);

  const {
    stakeNear,
    isStakingNear,
    stakingNearError,
    unstakeAll,
    withdrawAll,
    isUnstakingAll,
    isWithdrawingAll,
    unstakingAllError,
    withdrawingAllError,
  } = useStakeNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { lockNear } = useLockNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { transferNear } = useNear();

  const { selectStakingPoolAsync, error: selectStakingPoolError } =
    useSelectStakingPool({
      lockupAccountId: lockupAccountId ?? "",
    });

  // Refresh staking pool balance (e.g., to surface rewards or post-cooldown availability)
  const {
    refreshStakingPoolBalanceAsync,
    error: refreshStakingPoolBalanceError,
  } = useRefreshStakingPoolBalance({
    lockupAccountId: lockupAccountId ?? "",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefreshStakingBalance = useCallback(async () => {
    console.log("[StakingReview] Refresh balance clicked", {
      lockupAccountId,
      currentStakingPoolId,
    });
    try {
      setIsRefreshing(true);
      console.log("[StakingReview] Calling refresh_staking_pool_balance");
      await refreshStakingPoolBalanceAsync();
      console.log("[StakingReview] Refresh balance completed");
    } catch (e) {
      console.error("[StakingReview] Refresh balance error", e);
      throw e;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshStakingPoolBalanceAsync, lockupAccountId, currentStakingPoolId]);

  // Detect whether we can unselect the staking pool (must have 0 deposited/staked)
  const { stakedBalance, isLoading: isLoadingStakedBalance } = useStakedBalance(
    {
      stakingPoolId: currentStakingPoolId,
      accountId: lockupAccountId,
    }
  );

  const { mutateAsync: writeLockupContract } = useWriteHOSContract({
    contractType: "LOCKUP",
  });
  const [isUnselecting, setIsUnselecting] = useState(false);
  const [unselectError, setUnselectError] = useState<Error | null>(null);

  const canUnselect = useMemo(() => {
    if (!currentStakingPoolId) return false;
    try {
      return !isLoadingStakedBalance && Big(stakedBalance ?? "0").eq(0);
    } catch {
      return false;
    }
  }, [currentStakingPoolId, isLoadingStakedBalance, stakedBalance]);

  const onUnselectStakingPool = useCallback(async () => {
    console.log("[StakingReview] Unselect staking pool clicked", {
      lockupAccountId,
      currentStakingPoolId,
      canUnselect,
    });
    try {
      setIsUnselecting(true);
      setUnselectError(null);
      console.log("[StakingReview] Calling unselect_staking_pool");
      await writeLockupContract({
        contractId: lockupAccountId ?? "",
        methodCalls: [
          {
            methodName: "unselect_staking_pool",
            args: {},
          },
        ],
      });
      console.log("[StakingReview] Unselect staking pool completed");
    } catch (e) {
      console.error("[StakingReview] Unselect staking pool error", e);
      setUnselectError(e as Error);
    } finally {
      setIsUnselecting(false);
    }
  }, [writeLockupContract, lockupAccountId, currentStakingPoolId, canUnselect]);

  const stakeError = useMemo(() => {
    if (stakingNearError) {
      return "Something went wrong staking your funds.";
    }
    if (selectStakingPoolError) {
      return "Something went wrong selecting a staking pool.";
    }
    return null;
  }, [stakingNearError, selectStakingPoolError]);

  const topUpAmount = useMemo(() => {
    try {
      const max = Big(maxStakingAmount ?? "0");
      const desired = Big(enteredAmountYoctoNear ?? "0");
      return desired.gt(max) ? desired.minus(max).toFixed(0) : "0";
    } catch {
      return "0";
    }
  }, [enteredAmountYoctoNear, maxStakingAmount]);

  const requiredSteps = useMemo(() => {
    const steps: (StakingStep | "top_up" | "lock")[] = [];
    if (needsToSelectPool) {
      steps.push("select_pool");
    }
    if (Big(topUpAmount).gt(0)) {
      steps.push("top_up");
    }
    steps.push("stake");
    return steps;
  }, [topUpAmount]);

  const onStake = useCallback(
    async ({ startAtStep = 0 }: { startAtStep?: number }) => {
      console.log("[StakingReview] onStake start", {
        startAtStep,
        requiredSteps,
        selectedPool: selectedPool.contract,
        lockupAccountId,
        topUpAmount,
      });
      try {
        setIsSubmitting(true);

        for (let i = startAtStep; i < requiredSteps.length; i++) {
          const step = requiredSteps[i];
          setStakingStep(i);
          console.log("[StakingReview] executing step", { index: i, step });

          if (step === "select_pool") {
            console.log("[StakingReview] step select_pool", {
              stakingPoolId: selectedPool.contract,
            });
            await selectStakingPoolAsync({
              stakingPoolId: selectedPool.contract,
            });
          } else if (step === "top_up") {
            console.log("[StakingReview] step top_up", {
              receiverId: lockupAccountId ?? "",
              amount: topUpAmount,
            });
            await transferNear({
              receiverId: lockupAccountId ?? "",
              amount: topUpAmount,
            });
          } else if (step === "lock") {
            console.log("[StakingReview] step lock", { amount: topUpAmount });
            await lockNear({ amount: topUpAmount });
          } else if (step === "stake") {
            console.log("[StakingReview] step stake", {
              amount: enteredAmountYoctoNear,
            });
            await stakeNear(enteredAmountYoctoNear);
          }
        }

        setIsStakeCompleted(true);
        console.log("[StakingReview] onStake completed successfully");
      } catch (e) {
        console.error("[StakingReview] Staking error", e);
      } finally {
        setIsSubmitting(false);
        console.log("[StakingReview] onStake end");
      }
    },
    [
      enteredAmountYoctoNear,
      requiredSteps,
      selectStakingPoolAsync,
      selectedPool.contract,
      stakeNear,
      lockNear,
      lockupAccountId,
      topUpAmount,
      transferNear,
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
              {`${selectedStats?.apy?.toFixed(2) ?? "-"}% APY (Estimated)`}
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
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !showAdvanced;
                console.log("[StakingReview] Toggle Advanced", { next });
                setShowAdvanced(next);
              }}
              className="text-sm font-medium underline"
            >
              {showAdvanced ? "Hide advanced" : "Advanced"}
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full p-1 hover:bg-muted"
                  aria-label="About legacy pools"
                >
                  <Info className="h-4 w-4 text-[#9D9FA1]" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Legacy pools</p>
                  <p className="text-secondary">
                    If you previously staked via your lockup contract in a pool,
                    use Advanced to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-secondary">
                    <li>Unstake all to start the cooldown.</li>
                    <li>Withdraw all after the cooldown completes.</li>
                    <li>Refresh balance to sync rewards/availability.</li>
                    <li>
                      Unselect the staking pool when balance is 0 to switch
                      pools.
                    </li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {showAdvanced && (
            <div className="mt-3 flex flex-col gap-3">
              <div className="text-xs text-[#9D9FA1]">
                Manage your staked funds via your lockup contract
              </div>

              <div className="text-xs">
                {currentStakingPoolId ? (
                  <>
                    Selected pool:{" "}
                    <span className="font-medium">{currentStakingPoolId}</span>
                  </>
                ) : (
                  <>No staking pool selected</>
                )}
              </div>

              <div className="flex gap-2">
                <UpdatedButton
                  onClick={onRefreshStakingBalance}
                  isLoading={isRefreshing}
                  variant="rounded"
                >
                  Refresh balance
                </UpdatedButton>
                <UpdatedButton
                  onClick={unstakeAll}
                  isLoading={isUnstakingAll}
                  variant="rounded"
                >
                  Unstake all
                </UpdatedButton>
                <UpdatedButton
                  onClick={withdrawAll}
                  isLoading={isWithdrawingAll}
                  variant="rounded"
                >
                  Withdraw all
                </UpdatedButton>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs text-[#9D9FA1]">
                  To change your staking pool, you must have 0 deposited balance
                  in the current pool.
                </div>
                <div className="flex gap-2 items-center">
                  <UpdatedButton
                    onClick={onUnselectStakingPool}
                    isLoading={isUnselecting}
                    disabled={!canUnselect}
                    variant="rounded"
                  >
                    Unselect staking pool
                  </UpdatedButton>
                  {!canUnselect && currentStakingPoolId && (
                    <div className="text-xs text-[#9D9FA1]">
                      Unstake and withdraw all first, then Refresh balance.
                    </div>
                  )}
                </div>
              </div>

              {refreshStakingPoolBalanceError && (
                <div className="text-xs text-red-500">
                  {refreshStakingPoolBalanceError.message}
                </div>
              )}
              {unstakingAllError && (
                <div className="text-xs text-red-500">
                  {unstakingAllError.message}
                </div>
              )}
              {withdrawingAllError && (
                <div className="text-xs text-red-500">
                  {withdrawingAllError.message}
                </div>
              )}
              {unselectError && (
                <div className="text-xs text-red-500">
                  {unselectError.message}
                </div>
              )}
            </div>
          )}
        </div>

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
