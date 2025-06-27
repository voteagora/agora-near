import { memo } from "react";
import { LockableAssetRow } from "./LockableAssetRow";
import { VeNearAssetRow } from "./VeNearAssetRow";
import { VeNearLiquidAssetRow } from "./VeNearLiquidAssetRow";
import { VeNearStakedAssetRow } from "./VeNearStakedAssetRow";

interface HoldingsContentProps {
  lockupLiquidTokens: any[];
  walletTokens: any[];
  unlockTimestamp: string | null | undefined;
  lockupAccountId: string | null | undefined;
  balanceWithRewards: string;
  hasPendingBalance: boolean;
  pendingBalance: string | undefined;
  isEligibleToUnlock: boolean;
  stakingPoolId: string | null | undefined;
  stakedBalance: string | null | undefined;
  openLockDialog: (preSelectedTokenId?: string) => void;
}

export const HoldingsContent = memo(
  ({
    lockupLiquidTokens,
    walletTokens,
    unlockTimestamp,
    lockupAccountId,
    balanceWithRewards,
    hasPendingBalance,
    pendingBalance,
    isEligibleToUnlock,
    stakingPoolId,
    stakedBalance,
    openLockDialog,
  }: HoldingsContentProps) => {
    return (
      <table className="w-full">
        <tbody>
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
          {lockupLiquidTokens.map((token) => (
            <VeNearLiquidAssetRow
              key={token.accountId}
              token={token}
              stakingPoolId={stakingPoolId ?? undefined}
              onLockClick={openLockDialog}
              lockupAccountId={lockupAccountId ?? undefined}
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
                  <h3 className="text-lg font-semibold">Wallet Holdings</h3>
                </td>
              </tr>
              {walletTokens.map((token) => (
                <LockableAssetRow
                  key={token.accountId}
                  token={token}
                  stakingPoolId={stakingPoolId ?? undefined}
                  onLockClick={openLockDialog}
                />
              ))}
            </>
          )}
        </tbody>
      </table>
    );
  }
);

HoldingsContent.displayName = "HoldingsContent";
