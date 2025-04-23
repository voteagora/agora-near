import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";

export interface VeNearStats {
  totalSupply: string;
  lockupDeploymentCost: string;
  accountBalance?: string;
  liquidBalance?: string;
  storageDepositAmount: string;
  minAccountBalance: string;
  stakingPoolWhitelistId: string;
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

export function useVenearStats(): {
  data: VeNearStats | null;
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

  const contractInfo: VeNearStats = {
    totalSupply: totalSupply?.toString() || "0",
    lockupDeploymentCost: lockupDeploymentCost?.toString() || "0",
    storageDepositAmount: storageBalanceBounds?.min?.toString() || "0",
    minAccountBalance: storageBalanceBounds?.min?.toString() || "0",
    stakingPoolWhitelistId:
      config?.staking_pool_whitelist_account_id?.toString() || "unknown",
  };

  return { data: contractInfo, isLoading: false, error: null };
}
