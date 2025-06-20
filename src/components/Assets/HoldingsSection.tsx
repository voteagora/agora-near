import { useNear } from "@/contexts/NearContext";
import { useAvailableTokens } from "@/hooks/useAvailableTokens";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useLockupPendingBalance } from "@/hooks/useLockupPendingBalance";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import Big from "big.js";
import { memo, useCallback, useMemo, useState } from "react";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { Skeleton } from "../ui/skeleton";
import { LockableAssetRow } from "./LockableAssetRow";
import { VeNearAssetRow } from "./VeNearAssetRow";
import { VeNearLiquidAssetRow } from "./VeNearLiquidAssetRow";
import { VeNearStakedAssetRow } from "./VeNearStakedAssetRow";

export const HoldingsSection = memo(() => {
  const [activeTab, setActiveTab] = useState<"Holdings" | "Activity">(
    "Holdings"
  );

  const { signedAccountId } = useNear();

  const handleTabClick = useCallback((tab: "Holdings" | "Activity") => {
    setActiveTab(tab);
  }, []);

  const { isLoading: isLoadingAvailableTokens, availableTokens } =
    useAvailableTokens();

  const { lockupAccountId, isLoading: isLoadingLockupAccountId } =
    useLockupAccount();

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

  const { stakedBalance, isLoading: isLoadingStakedBalance } = useStakedBalance(
    {
      stakingPoolId,
      accountId: lockupAccountId,
    }
  );

  const openDialog = useOpenDialog();

  const openLockDialog = useCallback(
    (preSelectedTokenId?: string) => {
      openDialog({
        type: "NEAR_LOCK",
        className: "sm:w-[500px]",
        params: {
          source: "account_management",
          preSelectedTokenId,
        },
      });
    },
    [openDialog]
  );

  const lockupLiquidTokens = useMemo(
    () => availableTokens.filter((token) => token.type === "lockup"),
    [availableTokens]
  );

  const walletTokens = useMemo(
    () => availableTokens.filter((token) => token.type !== "lockup"),
    [availableTokens]
  );

  const isLoading =
    isLoadingAvailableTokens ||
    isLoadingLockupAccountId ||
    isLoadingStakingPoolId ||
    isLoadingAccountInfo ||
    isLoadingLockupPendingBalance ||
    isLoadingStakedBalance;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabClick("Holdings")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "Holdings"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Holdings
          </button>
          <button
            onClick={() => handleTabClick("Activity")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "Activity"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Activity
          </button>
        </div>

        <div className="p-6">
          {activeTab === "Holdings" ? (
            <table className="w-full">
              <tbody>
                <tr>
                  <td colSpan={3} className="pb-3">
                    <h3 className="text-lg font-semibold">Lockup Holdings</h3>
                  </td>
                </tr>
                <VeNearAssetRow
                  unlockTimestamp={unlockTimestamp}
                  lockupAccountId={lockupAccountId}
                  balanceWithRewards={balanceWithRewards}
                  hasPendingBalance={hasPendingBalance}
                  pendingBalance={pendingBalance}
                  isEligibleToUnlock={isEligibleToUnlock}
                />
                {lockupLiquidTokens.map((token) => (
                  <VeNearLiquidAssetRow
                    key={token.accountId}
                    token={token}
                    stakingPoolId={stakingPoolId}
                    onLockClick={openLockDialog}
                    lockupAccountId={lockupAccountId}
                  />
                ))}
                {stakingPoolId && (
                  <VeNearStakedAssetRow
                    stakingPoolId={stakingPoolId}
                    stakedBalance={stakedBalance ?? "0"}
                  />
                )}
                {walletTokens.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={3} className="pt-8 pb-3">
                        <h3 className="text-lg font-semibold">
                          Wallet Holdings
                        </h3>
                      </td>
                    </tr>
                    {walletTokens.map((token) => (
                      <LockableAssetRow
                        key={token.accountId}
                        token={token}
                        stakingPoolId={stakingPoolId}
                        onLockClick={openLockDialog}
                      />
                    ))}
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Activity tab content coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

HoldingsSection.displayName = "HoldingsSection";
