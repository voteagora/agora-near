import { filterDust } from "@/lib/tokenUtils";
import { LockupLiquidBalance, TokenWithBalance } from "@/lib/types";
import { memo, useMemo } from "react";
import { LockableAssetRow } from "./LockableAssetRow";
import { VeNearAssetRow } from "./VeNearAssetRow";
import { LockupLiquidNearRow } from "./VeNearLiquidAssetRow";
import { VeNearStakedAssetRow } from "./VeNearStakedAssetRow";
import Big from "big.js";

interface HoldingsContentProps {
  liquidLockupBalance: LockupLiquidBalance;
  walletTokens: TokenWithBalance[];
  unlockTimestamp: string | null | undefined;
  lockupAccountId: string | null | undefined;
  balanceWithRewards: string;
  hasPendingBalance: boolean;
  pendingBalance: string | undefined;
  isEligibleToUnlock: boolean;
  stakingPoolId: string | null | undefined;
  stakedBalance: string | null | undefined;
  openLockDialog: (preSelectedTokenId?: string | null) => void;
  openStakingDialog: () => void;
}

export const HoldingsContent = memo(
  ({
    liquidLockupBalance,
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
    const filteredWalletTokens = useMemo(
      () =>
        walletTokens.map((token) => ({
          ...token,
          balance: filterDust({ amount: token.balance }),
        })),
      [walletTokens]
    );

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
          {hasLiquidNearInLockup && (
            <LockupLiquidNearRow
              liquidLockupBalance={filteredLiquidLockupBalance}
              onStakeClick={openStakingDialog}
              onLockClick={openLockDialog}
              lockupAccountId={lockupAccountId}
            />
          )}
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
