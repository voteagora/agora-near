import { useNear } from "@/contexts/NearContext";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useBalance } from "@/hooks/useBalance";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useStakingPool } from "@/hooks/useStakingPool";
import { useVenearSnapshot } from "@/hooks/useVenearSnapshot";
import { getAPYFromGrowthRate } from "@/lib/lockUtils";
import {
  LINEAR_TOKEN_CONTRACT,
  STNEAR_TOKEN_CONTRACT,
  RNEAR_TOKEN_CONTRACT,
} from "@/lib/constants";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLockupAccount } from "../../hooks/useLockupAccount";
import { useVenearAccountInfo } from "../../hooks/useVenearAccountInfo";
import { useVenearConfig } from "../../hooks/useVenearConfig";

type TokenType = "near" | "lst";

type TokenBalance = {
  type: TokenType;
  contractId?: string;
  symbol: string;
  balance: string;
};

// Re-export for consumers expecting these symbols from this module
export const LINEAR_TOKEN_CONTRACT_ID = LINEAR_TOKEN_CONTRACT;
export const STNEAR_TOKEN_CONTRACT_ID = STNEAR_TOKEN_CONTRACT;
export const RNEAR_TOKEN_CONTRACT_ID = RNEAR_TOKEN_CONTRACT;

const ONBOARDING_POOLS: string[] = [
  LINEAR_TOKEN_CONTRACT_ID,
  STNEAR_TOKEN_CONTRACT_ID,
  RNEAR_TOKEN_CONTRACT_ID,
].filter(Boolean);

type OnboardingContextType = {
  isLoading: boolean;
  error: Error | null;
  preferredStakingPoolId?: string;
  setPreferredStakingPoolId: (poolId: string) => void;
  lockupAccountId: string | null;
  storageDepositAmount: string | null;
  lockupDeploymentCost: string | null;
  stakingPools: string[];
  selectedToken?: TokenBalance;
  setSelectedToken: (token: TokenBalance) => void;
  availableTokens: TokenBalance[];
  venearAccountInfo?: ReturnType<typeof useVenearAccountInfo>["data"];
  currentStakingPoolId?: string | null;
  enteredAmount: string;
  setEnteredAmount: (amount: string) => void;
  stNearPrice: string | null;
  liNearPrice: string | null;
  rNearPrice: string | null;
  lockApy: string;
  stakeApy: string;
};

export const OnboardingContext = createContext<OnboardingContextType>({
  isLoading: false,
  error: null,
  preferredStakingPoolId: undefined,
  setPreferredStakingPoolId: () => {},
  lockupAccountId: null,
  storageDepositAmount: null,
  lockupDeploymentCost: null,
  selectedToken: undefined,
  setSelectedToken: () => {},
  stakingPools: ONBOARDING_POOLS,
  availableTokens: [],
  venearAccountInfo: undefined,
  currentStakingPoolId: undefined,
  enteredAmount: "",
  setEnteredAmount: () => {},
  stNearPrice: null,
  liNearPrice: null,
  rNearPrice: null,
  lockApy: "5.99%",
  stakeApy: "5.99%",
});

export const useHouseOfStakeOnboardingContext = () => {
  return useContext(OnboardingContext);
};

export const HouseOfStakeOnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { signedAccountId } = useNear();

  const [selectedStakingPoolId, setSelectedStakingPoolId] = useState<
    string | undefined
  >();

  const [selectedToken, setSelectedToken] = useState<
    TokenBalance | undefined
  >();

  const [enteredAmount, setEnteredAmount] = useState<string>("");

  const {
    data: fungibleTokensResponse,
    isLoading: isLoadingFungibleTokens,
    error: fungibleTokensError,
  } = useFungibleTokens(signedAccountId);

  const { nearBalance, isLoadingNearBalance, nearBalanceError } =
    useBalance(signedAccountId);

  const {
    venearStorageCost,
    lockupStorageCost,
    isLoading: isLoadingVenearConfig,
    error: venearConfigError,
  } = useVenearConfig({ enabled: !!signedAccountId });

  const {
    data: venearAccountInfo,
    isLoading: isLoadingVeNearAccount,
    error: venearAccountInfoError,
  } = useVenearAccountInfo(signedAccountId);

  const {
    lockupAccountId,
    isLoading: isLoadingLockupAccount,
    error: lockupAccountError,
  } = useLockupAccount();

  const { growthRateNs } = useVenearSnapshot();

  const lockupAPY = useMemo(
    () => getAPYFromGrowthRate(growthRateNs),
    [growthRateNs]
  );

  const { stakingPoolId, isLoadingStakingPoolId } = useCurrentStakingPoolId({
    lockupAccountId: lockupAccountId ?? "",
    enabled: !!venearAccountInfo,
  });

  const { stakingPools, isLoading: isLoadingConversionRates } =
    useStakingPool();

  const onTokenSelected = useCallback((token: TokenBalance) => {
    setSelectedToken(token);

    if (token.type === "lst") {
      setSelectedStakingPoolId(token.contractId);
    }
  }, []);

  const onStakingPoolSelected = useCallback((stakingPoolId: string) => {
    setSelectedStakingPoolId(stakingPoolId);
  }, []);

  const isInitializing =
    isLoadingVenearConfig ||
    isLoadingVeNearAccount ||
    isLoadingLockupAccount ||
    isLoadingFungibleTokens ||
    isLoadingNearBalance ||
    isLoadingStakingPoolId ||
    isLoadingConversionRates;

  const availableTokens = useMemo(() => {
    const tokens: TokenBalance[] = [];

    if (nearBalance) {
      tokens.push({
        type: "near",
        symbol: "NEAR",
        balance: nearBalance,
      });
    }

    if (fungibleTokensResponse) {
      tokens.push(
        ...fungibleTokensResponse.tokens
          .map((token) => {
            if (token.contract_id === LINEAR_TOKEN_CONTRACT_ID) {
              return {
                type: "lst",
                contractId: LINEAR_TOKEN_CONTRACT_ID,
                symbol: "liNEAR",
                balance: token.balance,
              } as TokenBalance;
            }

            if (token.contract_id === STNEAR_TOKEN_CONTRACT_ID) {
              return {
                type: "lst",
                contractId: STNEAR_TOKEN_CONTRACT_ID,
                symbol: "stNEAR",
                balance: token.balance,
              } as TokenBalance;
            }

            if (token.contract_id === RNEAR_TOKEN_CONTRACT_ID) {
              return {
                type: "lst",
                contractId: RNEAR_TOKEN_CONTRACT_ID,
                symbol: "rNEAR",
                balance: token.balance,
              } as TokenBalance;
            }

            return null;
          })
          .filter((token) => token !== null)
      );
    }

    return tokens;
  }, [fungibleTokensResponse, nearBalance]);

  return (
    <OnboardingContext.Provider
      value={{
        venearAccountInfo,
        setPreferredStakingPoolId: onStakingPoolSelected,
        currentStakingPoolId: stakingPoolId,
        selectedToken,
        setSelectedToken: onTokenSelected,
        availableTokens,
        stakingPools: ONBOARDING_POOLS,
        preferredStakingPoolId: selectedStakingPoolId,
        lockupAccountId: lockupAccountId ?? null,
        storageDepositAmount: venearStorageCost.toString(),
        lockupDeploymentCost: lockupStorageCost.toString(),
        isLoading: isInitializing,
        error:
          venearConfigError ||
          venearAccountInfoError ||
          lockupAccountError ||
          fungibleTokensError ||
          nearBalanceError,
        enteredAmount,
        setEnteredAmount,
        stNearPrice: stakingPools.stNear.price ?? null,
        liNearPrice: stakingPools.liNear.price ?? null,
        rNearPrice: stakingPools.rNear?.price ?? null,
        lockApy: lockupAPY,
        stakeApy: "5.99%",
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
