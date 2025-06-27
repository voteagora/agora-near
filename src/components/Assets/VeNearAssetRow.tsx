import { useCompleteUnlock } from "@/hooks/useCompleteUnlock";
import { VENEAR_TOKEN_METADATA } from "@/lib/constants";
import { getFormattedUnlockTimestamp } from "@/lib/lockUtils";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { memo, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import NearTokenAmount from "../shared/NearTokenAmount";
import { TooltipWithTap } from "../ui/tooltip-with-tap";
import { ResponsiveAssetRow } from "./ResponsiveAssetRow";

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

    const { completeUnlock } = useCompleteUnlock({
      lockupAccountId: lockupAccountId ?? "",
      onSuccess: () => toast.success("Unlock complete"),
    });

    const handleUnlockTokens = useCallback(() => {
      if (isEligibleToUnlock && hasPendingBalance) {
        completeUnlock({ amount: pendingBalance });
        return;
      }

      openDialog({
        type: "NEAR_UNLOCK",
        params: {},
      });
    }, [
      openDialog,
      isEligibleToUnlock,
      hasPendingBalance,
      completeUnlock,
      pendingBalance,
    ]);

    const pendingBalanceCol = useMemo(() => {
      if (!hasPendingBalance) return null;

      return {
        title: (
          <>
            <div className="flex flex-row items-center gap-2">
              <span>
                {isEligibleToUnlock ? "Ready for unlock" : "Pending unlock"}
              </span>
              {unlockTimestamp && !isEligibleToUnlock && (
                <TooltipWithTap
                  content={
                    <div className="max-w-[300px]">
                      <p>
                        Funds can be unlocked after{" "}
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
              maximumSignificantDigits={4}
              minimumFractionDigits={4}
            />
          ),
        },
        ...(pendingBalanceCol ? [pendingBalanceCol] : []),
      ],
      [balanceWithRewards, pendingBalanceCol]
    );

    const overflowButtons = useMemo(
      () => [
        {
          title: "Unlock",
          onClick: handleUnlockTokens,
        },
      ],
      [handleUnlockTokens]
    );

    return (
      <ResponsiveAssetRow
        metadata={VENEAR_TOKEN_METADATA}
        columns={columns}
        showOverflowMenu
        overflowButtons={overflowButtons}
      />
    );
  }
);

VeNearAssetRow.displayName = "VeNearAssetRow";
