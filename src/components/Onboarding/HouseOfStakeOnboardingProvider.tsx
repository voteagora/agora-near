import { useNear } from "@/contexts/NearContext";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useNearBalance } from "@/hooks/useNearBalance";
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

const LINEAR_TOKEN_CONTRACT_ID = "linear-protocol.testnet";
const STNEAR_TOKEN_CONTRACT_ID = "meta-v2.pool.testnet";

const ONBOARDING_POOLS: string[] = [
  LINEAR_TOKEN_CONTRACT_ID,
  STNEAR_TOKEN_CONTRACT_ID,
];

type OnboardingContextType = {
  isLoading: boolean;
  error: Error | null;
  selectedStakingPoolId?: string;
  setSelectedStakingPoolId: (poolId: string) => void;
  lockupAccountId: string | null;
  storageDepositAmount: string | null;
  lockupDeploymentCost: string | null;
  stakingPools: string[];
  selectedToken?: TokenBalance;
  setSelectedToken: (token: TokenBalance) => void;
  availableTokens: TokenBalance[];
  venearAccountInfo?: ReturnType<typeof useVenearAccountInfo>["data"];
};

export const OnboardingContext = createContext<OnboardingContextType>({
  isLoading: false,
  error: null,
  selectedStakingPoolId: undefined,
  setSelectedStakingPoolId: () => {},
  lockupAccountId: null,
  storageDepositAmount: null,
  lockupDeploymentCost: null,
  selectedToken: undefined,
  setSelectedToken: () => {},
  stakingPools: ONBOARDING_POOLS,
  availableTokens: [],
  venearAccountInfo: undefined,
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
    isLoadingNearBalance;

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
        setSelectedStakingPoolId: onStakingPoolSelected,
        selectedToken,
        setSelectedToken: onTokenSelected,
        availableTokens,
        stakingPools: ONBOARDING_POOLS,
        selectedStakingPoolId,
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
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
