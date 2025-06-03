import { useNear } from "@/contexts/NearContext";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { useStakingPool } from "@/hooks/useStakingPool";
import { useStakingPoolStats } from "@/hooks/useStakingPoolStats";
import {
  LINEAR_TOKEN_CONTRACTS,
  STNEAR_TOKEN_CONTRACTS,
} from "@/lib/constants";
import { isValidNearAmount } from "@/lib/utils";
import Big from "big.js";
import { utils } from "near-api-js";
import { NEAR_NOMINATION_EXP } from "near-api-js/lib/utils/format";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type StakingProviderContextType = {
  isLoading: boolean;
  error?: Error | null;
  lockupAccountId?: string | null;
  stakingPoolId?: string | null;
  enteredAmount: string;
  setEnteredAmount: (amount: string) => void;
  isStakingMax: boolean;
  onStakeMax: () => void;
  maxStakingAmount?: string;
  amountError: string | null;
  resetForm: () => void;
  liNearStats?: {
    apy: number;
    totalVolumeYocto: string;
  };
  stNearStats?: {
    apy: number;
    totalVolumeYocto: string;
  };
};

const StakingContext = createContext<StakingProviderContextType>({
  isLoading: false,
  error: null,
  lockupAccountId: undefined,
  stakingPoolId: undefined,
  enteredAmount: "",
  setEnteredAmount: () => {},
  isStakingMax: false,
  onStakeMax: () => {},
  maxStakingAmount: undefined,
  amountError: null,
  resetForm: () => {},
  liNearStats: undefined,
  stNearStats: undefined,
});

export const useStakingProviderContext = () => {
  return useContext(StakingContext);
};

type StakingProviderProps = {
  children: React.ReactNode;
  prefilledAmount?: string;
};

export const StakingProvider = ({
  children,
  prefilledAmount,
}: StakingProviderProps) => {
  const { networkId } = useNear();
  const [enteredAmount, setEnteredAmount] = useState(prefilledAmount ?? "");
  const [isStakingMax, setIsStakingMax] = useState(false);

  const {
    lockupAccountId,
    isLoading: isLoadingLockupAccount,
    error: lockupAccountError,
  } = useLockupAccount();

  const { stakingPools, isLoading: isLoadingStakingPools } = useStakingPool();

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

  const {
    stats,
    isLoading: isLoadingStakingPoolStats,
    error: stakingPoolStatsError,
  } = useStakingPoolStats({
    pools: [
      STNEAR_TOKEN_CONTRACTS[networkId],
      LINEAR_TOKEN_CONTRACTS[networkId],
    ],
  });

  // Calculate formatted stats with proper APY and total volume
  const formattedStats = useMemo(() => {
    const liNearRawStats = stats[LINEAR_TOKEN_CONTRACTS[networkId]];
    const stNearRawStats = stats[STNEAR_TOKEN_CONTRACTS[networkId]];

    const calculateTotalVolumeYocto = (
      supply: string,
      price: string | null | undefined
    ) => {
      if (!price || !supply) return "0";

      try {
        const totalVolumeYocto = new Big(supply)
          .div(10 ** NEAR_NOMINATION_EXP)
          .times(new Big(price));

        return totalVolumeYocto.toFixed(0);
      } catch {
        return "0";
      }
    };

    return {
      liNear: liNearRawStats
        ? {
            apy: liNearRawStats.apy * 100, // Convert decimal to percentage
            totalVolumeYocto: calculateTotalVolumeYocto(
              liNearRawStats.supply,
              stakingPools.liNear.price
            ),
          }
        : undefined,
      stNear: stNearRawStats
        ? {
            apy: stNearRawStats.apy * 100, // Convert decimal to percentage
            totalVolumeYocto: calculateTotalVolumeYocto(
              stNearRawStats.supply,
              stakingPools.stNear.price
            ),
          }
        : undefined,
    };
  }, [stats, stakingPools, networkId]);

  const enteredAmountYocto = useMemo(() => {
    if (!isValidNearAmount(enteredAmount)) {
      return "0";
    }

    return utils.format.parseNearAmount(enteredAmount) || "0";
  }, [enteredAmount]);

  const amountError = useMemo(() => {
    if (!enteredAmount) {
      return null;
    }

    // Check if the amount format is valid
    if (!isValidNearAmount(enteredAmount)) {
      return "Please enter a valid amount";
    }

    // Check if amount exceeds maximum available
    if (maxStakingAmount && Big(enteredAmountYocto).gt(Big(maxStakingAmount))) {
      return "Amount exceeds available balance";
    }

    return null;
  }, [enteredAmount, enteredAmountYocto, maxStakingAmount]);

  const onStakeMax = useCallback(() => {
    if (maxStakingAmount) {
      setEnteredAmount(utils.format.formatNearAmount(maxStakingAmount));
      setIsStakingMax(true);
    }
  }, [maxStakingAmount]);

  const resetForm = useCallback(() => {
    setEnteredAmount("");
    setIsStakingMax(false);
  }, []);

  const isLoading =
    isLoadingLockupAccount ||
    isLoadingStakingPoolId ||
    isLoadingStakingPoolStats ||
    isLoadingMaxStakingAmount ||
    isLoadingStakingPools;

  const error =
    lockupAccountError || stakingPoolStatsError || maxStakingAmountError;

  return (
    <StakingContext.Provider
      value={{
        stakingPoolId,
        enteredAmount,
        setEnteredAmount,
        isStakingMax,
        lockupAccountId,
        isLoading,
        liNearStats: formattedStats.liNear,
        stNearStats: formattedStats.stNear,
        error,
        onStakeMax,
        amountError,
        resetForm,
        maxStakingAmount,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};
