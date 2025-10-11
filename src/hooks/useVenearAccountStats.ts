import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";
import { useMemo } from "react";

// TODO: Decompose this hook - this is mainly for the debug menu
export function useVenearAccountStats(accountId: string | undefined | null) {
  const results = useReadHOSContract([
    {
      contractId: CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "ft_balance_of" as const,
      config: {
        args: { account_id: accountId || "" },
        enabled: !!accountId,
      },
    },
    {
      contractId: CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_account_info" as const,
      config: {
        args: { account_id: accountId || "" },
        enabled: !!accountId,
      },
    },
    {
      contractId: CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_lockup_account_id" as const,
      config: {
        args: { account_id: accountId || "" },
        enabled: !!accountId,
      },
    },
  ]);

  const [
    { data: veNearBalance, isLoading: isLoadingBalance, error: balanceError },
    { data: accountData, isLoading: isLoadingAccount, error: accountError },
    { data: lockupAccountId, isLoading: isLoadingLockup, error: lockupError },
  ] = results;

  const lockupResults = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_staking_pool_account_id" as const,
      config: {
        args: {},
        enabled: !!accountData,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_liquid_owners_balance" as const,
      config: {
        args: {},
        enabled: !!accountData,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_liquid_balance" as const,
      config: {
        args: {},
        enabled: !!accountData,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_pending_balance" as const,
      config: {
        args: {},
        enabled: !!accountData,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_unlock_timestamp" as const,
      config: {
        args: {},
        enabled: !!accountData,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_locked_balance" as const,
      config: {
        args: {},
        enabled: !!accountData,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_owners_balance" as const,
      config: {
        args: {},
        enabled: !!accountData,
      },
    },
  ]);

  const [
    { data: stakingPool, isLoading: isLoadingStaking },
    { data: liquidBalance, isLoading: isLoadingLiquid },
    { data: veNearLiquidBalance, isLoading: isLoadingVeNearLiquid },
    { data: veNearPendingBalance, isLoading: isLoadingVeNearPending },
    { data: veNearUnlockTimestamp, isLoading: isLoadingVeNearUnlock },
    { data: veNearLockedBalance, isLoading: isLoadingVeNearLocked },
    { data: ownersBalance, isLoading: isLoadingOwnersBalance },
  ] = lockupResults;

  const isLoading =
    isLoadingBalance ||
    isLoadingAccount ||
    isLoadingLockup ||
    isLoadingStaking ||
    isLoadingLiquid ||
    isLoadingVeNearLiquid ||
    isLoadingVeNearPending ||
    isLoadingVeNearUnlock ||
    isLoadingVeNearLocked ||
    isLoadingOwnersBalance;

  const error = balanceError || accountError || lockupError;

  const data = useMemo(() => {
    if (!accountId || error || isLoading) return null;

    const account = accountData?.account;

    if (!account) return null;

    return {
      accountId,
      veNearBalance: veNearBalance,
      totalBalance: {
        near: account.balance?.near_balance || "0",
        extraBalance: account.balance?.extra_venear_balance || "0",
      },
      delegatedBalance: {
        near: account.delegated_balance?.near_balance || "0",
        extraBalance: account.delegated_balance?.extra_venear_balance || "0",
      },
      delegation: account.delegation
        ? {
            delegatee: account.delegation.account_id,
          }
        : undefined,
      stakingPool: stakingPool,
      liquidBalance: liquidBalance,
      veNearLiquidBalance: veNearLiquidBalance,
      veNearPendingBalance: veNearPendingBalance,
      veNearUnlockTimestamp: veNearUnlockTimestamp,
      veNearLockedBalance: veNearLockedBalance,
      lockupAccountId: lockupAccountId,
      ownersBalance: ownersBalance,
    };
  }, [
    accountId,
    error,
    isLoading,
    accountData?.account,
    veNearBalance,
    stakingPool,
    liquidBalance,
    veNearLiquidBalance,
    veNearPendingBalance,
    veNearUnlockTimestamp,
    veNearLockedBalance,
    lockupAccountId,
    ownersBalance,
  ]);

  return {
    data,
    isLoading,
    error,
  };
}
