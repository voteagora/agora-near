import { useNear } from "@/contexts/NearContext";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useNearBalance } from "@/hooks/useNearBalance";
import { useStakingPool } from "@/hooks/useStakingPool";
import { useStakingPoolConversionRates } from "@/hooks/useStakingPoolConversionRates";
import { useVenearSnapshot } from "@/hooks/useVenearSnapshot";
import { getAPYFromGrowthRate } from "@/lib/lockUtils";
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

export const LINEAR_TOKEN_CONTRACT_ID = "linear-protocol.testnet";
export const STNEAR_TOKEN_CONTRACT_ID = "meta-v2.pool.testnet";

const ONBOARDING_POOLS: string[] = [
  LINEAR_TOKEN_CONTRACT_ID,
  STNEAR_TOKEN_CONTRACT_ID,
];

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
    useNearBalance(signedAccountId);

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

  const { stakingPoolId, isLoadingStakingPoolId } = useStakingPool({
    lockupAccountId: lockupAccountId ?? "",
    enabled: !!venearAccountInfo,
  });

  const { conversionRates, isLoading: isLoadingConversionRates } =
    useStakingPoolConversionRates();

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
        stNearPrice: conversionRates.stNearPrice ?? null,
        liNearPrice: conversionRates.liNearPrice ?? null,
        lockApy: lockupAPY,
        stakeApy: "5.99%",
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
