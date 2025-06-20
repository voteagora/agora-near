import { useUnlockAndWithdraw } from "@/hooks/useUnlockAndWithdraw";
import { VENEAR_TOKEN_METADATA } from "@/lib/constants";
import { getFormattedUnlockTimestamp } from "@/lib/lockUtils";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { memo, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import NearTokenAmount from "../shared/NearTokenAmount";
import { TooltipWithTap } from "../ui/tooltip-with-tap";
import { AssetRow } from "./AssetRow";

interface VeNearAssetRowProps {
  balanceWithRewards: string;
  hasPendingBalance: boolean;
  pendingBalance: string | undefined;
  isEligibleToUnlock: boolean | undefined;
  lockupAccountId?: string;
  unlockTimestamp?: string;
}

export const VeNearAssetRow = memo<VeNearAssetRowProps>(
  ({
    balanceWithRewards,
    hasPendingBalance,
    pendingBalance,
    isEligibleToUnlock,
    lockupAccountId,
    unlockTimestamp,
  }) => {
    const openDialog = useOpenDialog();

    const { unlockAndWithdraw, isLoading: isLoadingUnlockAndWithdraw } =
      useUnlockAndWithdraw({
        lockupAccountId: lockupAccountId ?? "",
        onSuccess: () => toast.success("Withdraw complete"),
      });

    const handleBeginUnlockTokens = useCallback(() => {
      openDialog({
        type: "NEAR_UNLOCK",
        params: {},
      });
    }, [openDialog]);

    const handleWithdrawTokens = useCallback(() => {
      unlockAndWithdraw({ amount: pendingBalance });
    }, [unlockAndWithdraw, pendingBalance]);

    const pendingBalanceCol = useMemo(() => {
      if (!hasPendingBalance) return null;

      return {
        title: (
          <>
            <div className="flex flex-row items-center gap-2">
              <span>
                {isEligibleToUnlock
                  ? "Available to withdraw"
                  : "Pending unlock"}
              </span>
              {unlockTimestamp && !isEligibleToUnlock && (
                <TooltipWithTap
                  content={
                    <div className="max-w-[300px]">
                      <p>
                        Funds available for withdrawal after{" "}
                        <span className="font-bold">
                          {getFormattedUnlockTimestamp(unlockTimestamp)}
                        </span>
                      </p>
                    </div>
                  }
                >
                  <InformationCircleIcon className="w-4 h-4" />
                </TooltipWithTap>
              )}
            </div>
          </>
        ),
        subtitle: (
          <NearTokenAmount
            amount={pendingBalance ?? "0"}
            maximumSignificantDigits={4}
            minimumFractionDigits={4}
          />
        ),
      };
    }, [
      hasPendingBalance,
      isEligibleToUnlock,
      pendingBalance,
      unlockTimestamp,
    ]);

    const columns = useMemo(
      () => [
        {
          title: "Locked",
          subtitle: (
            <NearTokenAmount
              amount={balanceWithRewards}
              currency={VENEAR_TOKEN_METADATA.symbol}
              maximumSignificantDigits={4}
              minimumFractionDigits={4}
            />
          ),
        },
        ...(pendingBalanceCol ? [pendingBalanceCol] : []),
      ],
      [balanceWithRewards, pendingBalanceCol]
    );

    const actionButton = useMemo(
      () =>
        hasPendingBalance
          ? {
              title: "Withdraw",
              onClick: handleWithdrawTokens,
              disabled: !isEligibleToUnlock,
              isLoading: isLoadingUnlockAndWithdraw,
            }
          : undefined,
      [
        hasPendingBalance,
        handleWithdrawTokens,
        isEligibleToUnlock,
        isLoadingUnlockAndWithdraw,
      ]
    );

    const overflowButtons = useMemo(
      () => [
        {
          title: "Unlock",
          onClick: handleBeginUnlockTokens,
        },
      ],
      [handleBeginUnlockTokens]
    );

    return (
      <AssetRow
        metadata={VENEAR_TOKEN_METADATA}
        columns={columns}
        actionButton={actionButton}
        showOverflowMenu
        overflowButtons={overflowButtons}
      />
    );
  }
);

VeNearAssetRow.displayName = "VeNearAssetRow";
