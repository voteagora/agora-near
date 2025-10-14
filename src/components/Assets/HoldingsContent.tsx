import { memo } from "react";
import Big from "big.js";
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
  openStakingDialog: () => void;
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
    openStakingDialog,
  }: HoldingsContentProps) => {
    // TODO: Fix root cause of dust amounts remaining after "Max" lock
    // This filters out dust amounts (<=0.001) as a temporary workaround
    const DUST_THRESHOLD = 0.001;
    const filterDust = (token: any) =>
      Big(token.balance).div("1e24").gte(DUST_THRESHOLD);

    const filteredLockupLiquidTokens = lockupLiquidTokens.filter(filterDust);
    const filteredWalletTokens = walletTokens.filter(filterDust);

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
          {filteredLockupLiquidTokens.map((token) => (
            <VeNearLiquidAssetRow
              key={token.accountId}
              token={token}
              onStakeClick={openStakingDialog}
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
          {filteredWalletTokens.length > 0 && (
            <>
              <tr>
                <td colSpan={3} className="pt-8 pb-3">
                  <h3 className="text-lg font-semibold">Wallet Holdings</h3>
                </td>
              </tr>
              {filteredWalletTokens.map((token) => (
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
