import { memo, useCallback, useMemo } from "react";
import { VENEAR_TOKEN_METADATA } from "@/lib/constants";
import NearTokenAmount from "../shared/NearTokenAmount";
import { AssetRow } from "./AssetRow";

interface VeNearAssetRowProps {
  balanceWithRewards: string;
  hasPendingBalance: string | boolean | undefined;
  pendingBalance: string | undefined;
  isEligibleToUnlock: boolean | undefined;
  onCompleteUnlockTokens: () => void;
  onBeginUnlockTokens: () => void;
}

export const VeNearAssetRow = memo<VeNearAssetRowProps>(
  ({
    balanceWithRewards,
    hasPendingBalance,
    pendingBalance,
    isEligibleToUnlock,
    onCompleteUnlockTokens,
    onBeginUnlockTokens,
  }) => {
    const handleBeginUnlockTokens = useCallback(() => {
      onBeginUnlockTokens();
    }, [onBeginUnlockTokens]);

    const handleCompleteUnlockTokens = useCallback(() => {
      onCompleteUnlockTokens();
    }, [onCompleteUnlockTokens]);

    const hasValidPendingBalance = Boolean(hasPendingBalance);
    const isEligible = Boolean(isEligibleToUnlock);

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
        ...(hasValidPendingBalance
          ? [
              {
                title: "Unlock pending",
                subtitle: (
                  <NearTokenAmount
                    amount={pendingBalance ?? "0"}
                    maximumSignificantDigits={4}
                    minimumFractionDigits={4}
                  />
                ),
              },
            ]
          : []),
      ],
      [balanceWithRewards, hasValidPendingBalance, pendingBalance]
    );

    const actionButton = useMemo(
      () =>
        hasValidPendingBalance && isEligible
          ? {
              title: "Unlock tokens",
              onClick: handleCompleteUnlockTokens,
            }
          : undefined,
      [hasValidPendingBalance, isEligible, handleCompleteUnlockTokens]
    );

    const overflowButtons = useMemo(
      () => [
        {
          title: "New unlock",
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
