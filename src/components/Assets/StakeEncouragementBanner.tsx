"use client";

import { useMemo } from "react";
import Big from "big.js";
import { UpdatedButton } from "@/components/Button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useLiquidLockupBalance } from "@/hooks/useLiquidLockupBalance";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import { STAKE_ENCOURAGEMENT_BANNER_DISMISS_KEY } from "@/lib/constants";

type Props = {
  onStakeClick: () => void;
};

export default function StakeEncouragementBanner({ onStakeClick }: Props) {
  const [dismissed, setDismissed] = useLocalStorage<boolean>(
    STAKE_ENCOURAGEMENT_BANNER_DISMISS_KEY,
    false
  );

  const { lockupAccountId, isLoading: isLoadingLockup } = useLockupAccount();
  const { isLoading: isLoadingLiquid, liquidLockupBalance } =
    useLiquidLockupBalance({
      lockupAccountId,
    });
  const { stakingPoolId, isLoadingStakingPoolId } = useCurrentStakingPoolId({
    lockupAccountId,
  });
  const { stakedBalance, isLoading: isLoadingStaked } = useStakedBalance({
    stakingPoolId,
    accountId: lockupAccountId,
  });

  const isLoading =
    isLoadingLockup ||
    isLoadingLiquid ||
    isLoadingStakingPoolId ||
    isLoadingStaked;

  const shouldShow = useMemo(() => {
    if (dismissed || isLoading) return false;
    if (!lockupAccountId) return false;

    const liquid = Big(liquidLockupBalance?.stakableNearBalance ?? "0");
    const withdrawable = Big(
      liquidLockupBalance?.withdrawableNearBalance ?? "0"
    );
    const staked = Big(stakedBalance ?? "0");

    // Show if there is liquid NEAR in the lockup (stakable or withdrawable)
    // and either no pool is selected yet or the current staked amount is 0
    const hasLiquidInLockup = liquid.gt(0) || withdrawable.gt(0);
    const hasNoStake = !stakingPoolId || staked.lte(0);

    return hasLiquidInLockup && hasNoStake;
  }, [
    dismissed,
    isLoading,
    lockupAccountId,
    liquidLockupBalance,
    stakedBalance,
    stakingPoolId,
  ]);

  if (!shouldShow) return null;

  return (
    <div className="w-full rounded-lg border border-brandPrimary/30 bg-brandPrimary/5 p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-800 font-medium">
            You have NEAR in your lockup that is not staked. Stake it now to
            start earning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UpdatedButton
            type="primary"
            variant="rounded"
            onClick={onStakeClick}
          >
            Stake NEAR
          </UpdatedButton>
          <button
            aria-label="Dismiss"
            onClick={() => setDismissed(true)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
