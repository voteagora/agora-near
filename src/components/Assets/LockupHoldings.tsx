import { useNear } from "@/contexts/NearContext";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLiquidLockupBalance } from "@/hooks/useLiquidLockupBalance";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useLockupPendingBalance } from "@/hooks/useLockupPendingBalance";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import { useStakeNear } from "@/hooks/useStakeNear";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { useUnstakedBalance } from "@/hooks/useUnstakedBalance";
import { filterDust } from "@/lib/tokenUtils";
import Big from "big.js";
import { memo, useMemo } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import { VeNearAssetRow } from "./VeNearAssetRow";
import { LockupLiquidNearRow } from "./LockupLiquidNearRow";
import { VeNearStakedAssetRow } from "./VeNearStakedAssetRow";

interface LockupHoldingsProps {
  openLockDialog: (preSelectedTokenId?: string | null) => void;
  openStakingDialog: () => void;
  openUnstakeDialog: () => void;
}

export const LockupHoldings = memo(
  ({
    openLockDialog,
    openStakingDialog,
    openUnstakeDialog,
  }: LockupHoldingsProps) => {
    const { signedAccountId } = useNear();

    const { lockupAccountId, isLoading: isLoadingLockupAccountId } =
      useLockupAccount();

    const { isLoading: isLoadingLiquidLockupBalance, liquidLockupBalance } =
      useLiquidLockupBalance({ lockupAccountId });

    const { data: accountInfo, isLoading: isLoadingAccountInfo } =
      useVenearAccountInfo(signedAccountId);

    const {
      unlockTimestamp,
      pendingBalance,
      isEligibleToUnlock,
      hasPendingBalance,
      isLoading: isLoadingLockupPendingBalance,
    } = useLockupPendingBalance({
      lockupAccountId: lockupAccountId,
    });

    const balanceWithRewards = useMemo(
      () =>
        Big(accountInfo?.totalBalance.near ?? "0")
          .add(accountInfo?.totalBalance.extraBalance ?? "0")
          .toFixed(),
      [accountInfo]
    );

    const { stakingPoolId, isLoadingStakingPoolId } = useCurrentStakingPoolId({
      lockupAccountId,
    });

    const { stakedBalance, isLoading: isLoadingStakedBalance } =
      useStakedBalance({
        stakingPoolId,
        accountId: lockupAccountId,
      });

    const {
      unstakedBalance,
      isLoading: isLoadingUnstakedBalance,
      isAvailable: isUnstakedBalanceAvailable,
    } = useUnstakedBalance({
      stakingPoolId,
      accountId: lockupAccountId,
    });

    const { withdrawNear, isWithdrawingNear } = useStakeNear({
      lockupAccountId: lockupAccountId ?? "",
    });

    const filteredLiquidLockupBalance = useMemo(() => {
      return {
        withdrawableNearBalance: filterDust({
          amount: liquidLockupBalance.withdrawableNearBalance ?? "0",
        }),
        stakableNearBalance: filterDust({
          amount: liquidLockupBalance.stakableNearBalance ?? "0",
        }),
        lockableNearBalance: filterDust({
          amount: liquidLockupBalance.lockableNearBalance ?? "0",
        }),
      };
    }, [
      liquidLockupBalance.lockableNearBalance,
      liquidLockupBalance.stakableNearBalance,
      liquidLockupBalance.withdrawableNearBalance,
    ]);

    const hasLiquidNearInLockup = useMemo(
      () =>
        Big(filteredLiquidLockupBalance.lockableNearBalance ?? "0").gt(0) ||
        Big(filteredLiquidLockupBalance.stakableNearBalance ?? "0").gt(0) ||
        Big(filteredLiquidLockupBalance.withdrawableNearBalance ?? "0").gt(0),
      [
        filteredLiquidLockupBalance.lockableNearBalance,
        filteredLiquidLockupBalance.stakableNearBalance,
        filteredLiquidLockupBalance.withdrawableNearBalance,
      ]
    );

    const isLoading =
      isLoadingLockupAccountId ||
      isLoadingStakingPoolId ||
      isLoadingAccountInfo ||
      isLoadingLockupPendingBalance ||
      isLoadingStakedBalance ||
      isLoadingUnstakedBalance ||
      isLoadingLiquidLockupBalance;

    if (isLoading) {
      return (
        <>
          <tr>
            <td colSpan={3} className="pb-3">
              <h3 className="text-lg font-semibold">Lockup Holdings</h3>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <Skeleton className="h-14 w-full mb-2" />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <Skeleton className="h-14 w-full mb-2" />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <Skeleton className="h-14 w-full" />
            </td>
          </tr>
        </>
      );
    }

    return (
      <>
        <tr>
          <td colSpan={3} className="pb-3">
            <h3 className="text-lg font-semibold">Lockup Holdings</h3>
          </td>
        </tr>
        <VeNearAssetRow
          unlockTimestamp={unlockTimestamp ?? undefined}
          lockupAccountId={lockupAccountId ?? undefined}
          balanceWithRewards={balanceWithRewards}
          hasPendingBalance={hasPendingBalance}
          pendingBalance={pendingBalance}
          isEligibleToUnlock={isEligibleToUnlock}
        />
        {hasLiquidNearInLockup && (
          <LockupLiquidNearRow
            liquidLockupBalance={filteredLiquidLockupBalance}
            onStakeClick={openStakingDialog}
            onLockClick={openLockDialog}
            lockupAccountId={lockupAccountId}
          />
        )}
        {stakingPoolId && (
          <>
            <VeNearStakedAssetRow
              stakingPoolId={stakingPoolId}
              stakedBalance={stakedBalance ?? "0"}
              onUnstakeClick={openUnstakeDialog}
            />
            {Big(unstakedBalance ?? "0").gt(0) && (
              <VeNearStakedAssetRow
                stakingPoolId={stakingPoolId}
                stakedBalance={unstakedBalance ?? "0"}
                onUnstakeClick={async () => {
                  if (unstakedBalance) {
                    try {
                      await withdrawNear(unstakedBalance);
                      toast.success("Withdraw complete");
                    } catch (e: any) {
                      if (
                        e?.message?.includes("User rejected") ||
                        e?.message?.includes("user rejected")
                      ) {
                        return;
                      }
                      toast.error("Failed to withdraw");
                    }
                  }
                }}
                overrideTitle={
                  isUnstakedBalanceAvailable
                    ? "Available to withdraw"
                    : "Pending Release"
                }
                hideUnstakeButton={!isUnstakedBalanceAvailable}
                releaseTimeLabel={
                  isUnstakedBalanceAvailable ? "Now" : "~52-65 hours"
                }
                overrideUnstakeLabel="Withdraw"
                isLoading={isWithdrawingNear}
              />
            )}
          </>
        )}
      </>
    );
  }
);

LockupHoldings.displayName = "LockupHoldings";
