import { useNear } from "@/contexts/NearContext";
import { useLiquidWalletTokens } from "@/hooks/useAvailableTokens";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useLockupPendingBalance } from "@/hooks/useLockupPendingBalance";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import Big from "big.js";
import { memo, useCallback, useMemo, useState } from "react";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { Skeleton } from "../ui/skeleton";
import { HoldingsContent } from "./HoldingsContent";
import { HosActivityTable } from "./HosActivityTable";
import { useLiquidLockupBalance } from "@/hooks/useLiquidLockupBalance";

export const HoldingsSection = memo(() => {
  const [activeTab, setActiveTab] = useState<"Holdings" | "Activity">(
    "Holdings"
  );

  const { signedAccountId } = useNear();

  const handleTabClick = useCallback((tab: "Holdings" | "Activity") => {
    setActiveTab(tab);
  }, []);

  const {
    isLoading: isLoadingLiquidWalletTokens,
    availableTokens: liquidWalletTokens,
  } = useLiquidWalletTokens();

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

  const { stakedBalance, isLoading: isLoadingStakedBalance } = useStakedBalance(
    {
      stakingPoolId,
      accountId: lockupAccountId,
    }
  );

  const openDialog = useOpenDialog();

  const openLockDialog = useCallback(
    (preSelectedTokenId?: string | null) => {
      openDialog({
        type: "NEAR_LOCK",
        params: {
          source: "account_management",
          preSelectedTokenId: preSelectedTokenId ?? undefined,
        },
      });
    },
    [openDialog]
  );

  const openStakingDialog = useCallback(() => {
    openDialog({
      type: "NEAR_STAKING",
      className: "sm:w-[500px]",
      params: {
        source: "account_management",
      },
    });
  }, [openDialog]);

  const walletTokens = useMemo(
    () => liquidWalletTokens.filter((token) => token.type !== "lockup"),
    [liquidWalletTokens]
  );

  const isLoading =
    isLoadingLiquidWalletTokens ||
    isLoadingLockupAccountId ||
    isLoadingStakingPoolId ||
    isLoadingAccountInfo ||
    isLoadingLockupPendingBalance ||
    isLoadingStakedBalance ||
    isLoadingLiquidLockupBalance;

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
    <div className="flex-1 sm:px-6 pb-6">
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

        <div className="sm:px-6 py-6 px-2">
          {activeTab === "Holdings" ? (
            <HoldingsContent
              liquidLockupBalance={liquidLockupBalance}
              walletTokens={walletTokens}
              unlockTimestamp={unlockTimestamp}
              lockupAccountId={lockupAccountId}
              balanceWithRewards={balanceWithRewards}
              hasPendingBalance={hasPendingBalance}
              pendingBalance={pendingBalance}
              isEligibleToUnlock={isEligibleToUnlock}
              stakingPoolId={stakingPoolId}
              stakedBalance={stakedBalance}
              openLockDialog={openLockDialog}
              openStakingDialog={openStakingDialog}
            />
          ) : (
            <HosActivityTable address={signedAccountId} />
          )}
        </div>
      </div>
    </div>
  );
});

HoldingsSection.displayName = "HoldingsSection";
