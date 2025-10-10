import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { useStakingPoolExchangeRates } from "@/hooks/useStakingPoolExchangeRates";
import { useStakingPoolStats } from "@/hooks/useStakingPoolStats";
import { LINEAR_POOL, STNEAR_POOL, RNEAR_POOL } from "@/lib/constants";
import { useNear } from "@/contexts/NearContext";
import { StakingPool } from "@/lib/types";
import {
  convertNearToStakingToken,
  convertStakingTokenToNear,
  convertYoctoToNear,
  isValidNearAmount,
} from "@/lib/utils";
import Big from "big.js";
import { utils } from "near-api-js";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { StakingSource } from "./StakingDialog/StakingDialog";

const getSupportedPools = (networkId: string): StakingPool[] => {
  const base = [LINEAR_POOL, STNEAR_POOL];
  if (networkId === "mainnet") {
    return [...base, RNEAR_POOL];
  }
  return base;
};

type StakingProviderContextType = {
  isLoading: boolean;
  error?: Error | null;
  lockupAccountId?: string | null;
  currentStakingPoolId?: string | null;
  selectedPool: StakingPool;
  setSelectedPool: (pool: StakingPool) => void;
  enteredAmount: string;
  setEnteredAmount: (amount: string) => void;
  isStakingMax: boolean;
  onStakeMax: () => void;
  maxStakingAmount?: string;
  amountError: string | null;
  resetForm: () => void;
  amountInStakingToken: string;
  enteredAmountYoctoNear: string;
  pools: StakingPool[];
  poolStats: Record<string, { apy: number; totalVolumeYocto: string }>;
  source: StakingSource;
  hasAlreadySelectedStakingPool: boolean;
};

const StakingContext = createContext<StakingProviderContextType>({
  isLoading: false,
  error: null,
  lockupAccountId: undefined,
  selectedPool: LINEAR_POOL,
  currentStakingPoolId: undefined,
  setSelectedPool: () => {},
  enteredAmount: "",
  setEnteredAmount: () => {},
  isStakingMax: false,
  onStakeMax: () => {},
  maxStakingAmount: undefined,
  amountError: null,
  resetForm: () => {},
  amountInStakingToken: "0",
  pools: [],
  poolStats: {},
  enteredAmountYoctoNear: "0",
  source: "onboarding",
  hasAlreadySelectedStakingPool: false,
});

export const useStakingProviderContext = () => {
  return useContext(StakingContext);
};

type StakingProviderProps = {
  children: React.ReactNode;
  prefilledAmount?: string;
  source: StakingSource;
};

export const StakingProvider = ({
  children,
  prefilledAmount,
  source,
}: StakingProviderProps) => {
  const { networkId } = useNear();
  const supportedPools = useMemo(
    () => getSupportedPools(networkId),
    [networkId]
  );
  const [enteredAmount, setEnteredAmount] = useState(prefilledAmount ?? "");
  const [isStakingMax, setIsStakingMax] = useState(false);
  const [selectedPool, setSelectedPoolState] = useState<StakingPool>(
    supportedPools[0]
  );
  const [hasUserSelectedPool, setHasUserSelectedPool] = useState(false);

  const {
    lockupAccountId,
    isLoading: isLoadingLockupAccount,
    error: lockupAccountError,
  } = useLockupAccount();

  const { exchangeRateMap, isLoading: isLoadingStakingPools } =
    useStakingPoolExchangeRates({ pools: supportedPools });

  const [
    {
      data: maxStakingAmount,
      isLoading: isLoadingMaxStakingAmount,
      error: maxStakingAmountError,
    },
  ] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_liquid_owners_balance" as const,
      config: {
        args: {},
      },
    },
  ]);

  const { stakingPoolId, isLoadingStakingPoolId } = useCurrentStakingPoolId({
    lockupAccountId: lockupAccountId ?? "",
  });

  const preSelectedStakingPool = useMemo(() => {
    return supportedPools.find((pool) =>
      Object.values(pool.contracts).some(
        (contractId) => contractId === stakingPoolId
      )
    );
  }, [stakingPoolId, supportedPools]);

  const effectiveSelectedPool = useMemo(() => {
    return hasUserSelectedPool
      ? selectedPool
      : (preSelectedStakingPool ?? selectedPool);
  }, [hasUserSelectedPool, preSelectedStakingPool, selectedPool]);

  const { stats, error: stakingPoolStatsError } = useStakingPoolStats({
    pools: supportedPools,
  });

  const formattedStats = useMemo(() => {
    return supportedPools.reduce(
      (acc, curr) => {
        const rawStats = stats[curr.id];

        acc[curr.id] = {
          apy: (rawStats?.apy ?? 0) * 100,
          totalVolumeYocto: convertStakingTokenToNear(
            rawStats?.supply,
            exchangeRateMap[curr.id]
          ),
        };

        return acc;
      },
      {} as Record<string, { apy: number; totalVolumeYocto: string }>
    );
  }, [stats, exchangeRateMap, supportedPools]);

  const enteredAmountYoctoNear = useMemo(() => {
    if (isStakingMax) {
      // More robust to use the direct yocto amount rather than converting back and forth
      return maxStakingAmount ?? "0";
    }

    if (!isValidNearAmount(enteredAmount)) {
      return "0";
    }

    return utils.format.parseNearAmount(enteredAmount) || "0";
  }, [enteredAmount, isStakingMax, maxStakingAmount]);

  const amountInStakingToken = useMemo(() => {
    return convertNearToStakingToken(
      enteredAmountYoctoNear,
      exchangeRateMap[effectiveSelectedPool.id]
    );
  }, [enteredAmountYoctoNear, exchangeRateMap, effectiveSelectedPool.id]);

  const amountError = useMemo(() => {
    if (!enteredAmount) {
      return null;
    }

    // Check if the amount format is valid
    if (!isValidNearAmount(enteredAmount)) {
      return "Please enter a valid amount";
    }

    // Check if amount exceeds maximum available
    if (
      maxStakingAmount &&
      Big(enteredAmountYoctoNear).gt(Big(maxStakingAmount))
    ) {
      return "Amount exceeds available balance";
    }

    return null;
  }, [enteredAmount, enteredAmountYoctoNear, maxStakingAmount]);

  const onStakeMax = useCallback(() => {
    if (maxStakingAmount) {
      setEnteredAmount(convertYoctoToNear(maxStakingAmount));
      setIsStakingMax(true);
    }
  }, [maxStakingAmount]);

  const resetForm = useCallback(() => {
    setEnteredAmount("");
    setIsStakingMax(false);
  }, []);

  const setAmount = useCallback((amount: string) => {
    setIsStakingMax(false);
    setEnteredAmount(amount);
  }, []);

  const isLoading =
    isLoadingLockupAccount ||
    isLoadingStakingPoolId ||
    isLoadingMaxStakingAmount ||
    isLoadingStakingPools;

  const error =
    lockupAccountError || stakingPoolStatsError || maxStakingAmountError;

  const setSelectedPool = useCallback((pool: StakingPool) => {
    setHasUserSelectedPool(true);
    setSelectedPoolState(pool);
  }, []);

  return (
    <StakingContext.Provider
      value={{
        currentStakingPoolId: stakingPoolId,
        selectedPool: effectiveSelectedPool,
        hasAlreadySelectedStakingPool: !!preSelectedStakingPool,
        setSelectedPool,
        enteredAmount,
        setEnteredAmount: setAmount,
        isStakingMax,
        lockupAccountId,
        isLoading,
        error,
        onStakeMax,
        amountError,
        resetForm,
        maxStakingAmount,
        pools: supportedPools,
        poolStats: formattedStats,
        enteredAmountYoctoNear,
        amountInStakingToken,
        source,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};
