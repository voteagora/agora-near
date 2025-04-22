import { useReadHOSContract } from "@/hooks/useReadNearContract";
import { useMemo } from "react";
import { TESTNET_CONTRACTS } from "./constants";

export interface VeNearContractInfo {
  totalSupply: string;
  lockupDeploymentCost: string;
  accountBalance?: string;
  liquidBalance?: string;
  storageDepositAmount: string;
  minAccountBalance: string;
  stakingPoolWhitelistId: string;
}

export interface AccountInfo {
  accountId: string;
  totalBalance: {
    near: string;
    extraBalance: string;
  };
  delegatedBalance: {
    near: string;
    extraBalance: string;
  };
  delegation?: {
    delegatee: string;
    amount: {
      near: string;
      extraBalance: string;
    };
  };
  stakingPool?: string;
  liquidBalance?: string;
  veNearLiquidBalance?: string;
  veNearPendingBalance?: string;
  veNearUnlockTimestamp?: string;
  veNearLockedBalance?: string;
}

const queries = [
  {
    contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
    methodName: "ft_total_supply",
    config: {
      args: {},
    },
  },
  {
    contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
    methodName: "get_lockup_deployment_cost",
    config: {
      args: {},
    },
  },
  {
    contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
    methodName: "storage_balance_bounds",
    config: {
      args: {},
    },
  },
  {
    contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
    methodName: "get_config",
    config: {
      args: {},
    },
  },
] as const;

export function useVeNearContractInfo(): {
  data: VeNearContractInfo | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [
    {
      data: totalSupply,
      isLoading: isLoadingTotalSupply,
      error: totalSupplyError,
    },
    {
      data: lockupDeploymentCost,
      isLoading: isLoadingLockupCost,
      error: lockupError,
    },
    {
      data: storageBalanceBounds,
      isLoading: isLoadingStorage,
      error: storageError,
    },
    { data: config, isLoading: isLoadingConfig, error: configError },
  ] = useReadHOSContract(queries);

  const isLoading =
    isLoadingTotalSupply ||
    isLoadingLockupCost ||
    isLoadingStorage ||
    isLoadingConfig;

  const error = totalSupplyError || lockupError || storageError || configError;

  if (error) {
    return { data: null, isLoading: false, error };
  }

  if (isLoading) {
    return { data: null, isLoading: true, error: null };
  }

  const contractInfo: VeNearContractInfo = {
    totalSupply: totalSupply?.toString() || "0",
    lockupDeploymentCost: lockupDeploymentCost?.toString() || "0",
    storageDepositAmount: storageBalanceBounds?.min?.toString() || "0",
    minAccountBalance: storageBalanceBounds?.min?.toString() || "0",
    stakingPoolWhitelistId:
      config?.staking_pool_whitelist_account_id?.toString() || "unknown",
  };

  return { data: contractInfo, isLoading: false, error: null };
}

export function useAccountInfo(accountId: string | undefined | null) {
  const results = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "ft_balance_of" as const,
      config: {
        args: { account_id: accountId || "" },
        enabled: !!accountId,
      },
    },
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_account_info" as const,
      config: {
        args: { account_id: accountId || "" },
        enabled: !!accountId,
      },
    },
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
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
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_liquid_owners_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_liquid_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_pending_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_unlock_timestamp" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_locked_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_owners_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
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
