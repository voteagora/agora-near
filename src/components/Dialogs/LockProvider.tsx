import { useNear } from "@/contexts/NearContext";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useLockNear } from "@/hooks/useLockNear";
import { useNearBalance } from "@/hooks/useNearBalance";
import { useStakingPoolConversionRates } from "@/hooks/useStakingPoolConversionRates";
import { useVenearSnapshot } from "@/hooks/useVenearSnapshot";
import { getAPYFromGrowthRate } from "@/lib/lockUtils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useLockupAccount } from "../../hooks/useLockupAccount";
import { useVenearAccountInfo } from "../../hooks/useVenearAccountInfo";
import { useVenearConfig } from "../../hooks/useVenearConfig";
import { TokenBalance } from "@/lib/types";
import { STNEAR_TOKEN_CONTRACT_ID } from "@/lib/constants";
import { LINEAR_TOKEN_CONTRACT_ID } from "@/lib/constants";
import { utils } from "near-api-js";
import Big from "big.js";

type LockProviderContextType = {
  isLoading: boolean;
  error: Error | null;
  lockupAccountId: string | null;
  storageDepositAmount: string | null;
  lockupDeploymentCost: string | null;
  selectedToken?: TokenBalance;
  setSelectedToken: (token: TokenBalance) => void;
  availableTokens: TokenBalance[];
  venearAccountInfo?: ReturnType<typeof useVenearAccountInfo>["data"];
  stNearPrice: string | null;
  liNearPrice: string | null;
  lockApy: string;
  lockAmount: string;
  setLockAmount: (amount: string) => void;
  isLockingMax: boolean;
  onLockMax: () => void;
  availableToLock: string;
  lockNear: ({ amount }: { amount?: string }) => void;
  isLockingNear: boolean;
  lockingNearError: Error | null;
  venearAmount?: string;
};

export const LockProviderContext = createContext<LockProviderContextType>({
  isLoading: false,
  error: null,
  lockupAccountId: null,
  storageDepositAmount: null,
  lockupDeploymentCost: null,
  selectedToken: undefined,
  setSelectedToken: () => {},
  availableTokens: [],
  venearAccountInfo: undefined,
  stNearPrice: null,
  liNearPrice: null,
  lockApy: "5.99%",
  lockAmount: "",
  setLockAmount: () => {},
  isLockingMax: false,
  onLockMax: () => {},
  availableToLock: "0",
  lockNear: () => {},
  isLockingNear: false,
  lockingNearError: null,
  venearAmount: undefined,
});

export const useLockProviderContext = () => {
  return useContext(LockProviderContext);
};

type LockProviderProps = {
  children: React.ReactNode;
  onTokenSelected?: (token: TokenBalance) => void;
  onLockSuccess?: () => void;
};

export const LockProvider = ({
  children,
  onTokenSelected,
  onLockSuccess,
}: LockProviderProps) => {
  const { signedAccountId } = useNear();

  const [selectedToken, setSelectedToken] = useState<
    TokenBalance | undefined
  >();

  const [lockAmount, setLockAmount] = useState<string>("");
  const [isLockingMax, setIsLockingMax] = useState<boolean>(false);

  const onLockMax = useCallback(() => {
    if (selectedToken?.balance) {
      setLockAmount(selectedToken?.balance);
      setIsLockingMax(true);
    }
  }, [selectedToken?.balance]);

  const updateLockAmount = useCallback(
    (amount: string) => {
      setLockAmount(amount);
      setIsLockingMax(false);
    },
    [setLockAmount, setIsLockingMax]
  );

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

  const { lockNear, isLockingNear, lockingNearError } = useLockNear({
    lockupAccountId: lockupAccountId || "",
    onSuccess: () => {
      toast.success("Lock successful");
      onLockSuccess?.();
    },
  });

  const { growthRateNs } = useVenearSnapshot();

  const lockApy = useMemo(
    () => getAPYFromGrowthRate(growthRateNs),
    [growthRateNs]
  );

  const { conversionRates, isLoading: isLoadingConversionRates } =
    useStakingPoolConversionRates();

  const venearAmount = useMemo(() => {
    if (!lockAmount || !selectedToken) return "0";

    try {
      if (selectedToken.type === "near") {
        return utils.format.parseNearAmount(lockAmount) || "0";
      } else if (
        selectedToken.contractId === STNEAR_TOKEN_CONTRACT_ID &&
        conversionRates.stNearPrice
      ) {
        // Convert stNEAR to NEAR using the rate
        const valueInNear = new Big(lockAmount).times(
          conversionRates.stNearPrice
        );
        return valueInNear.toFixed(0);
      } else if (
        selectedToken.contractId === LINEAR_TOKEN_CONTRACT_ID &&
        conversionRates.liNearPrice
      ) {
        // Convert liNEAR to NEAR using the rate
        const valueInNear = new Big(lockAmount).times(
          conversionRates.liNearPrice
        );
        return valueInNear.toFixed(0);
      }
    } catch (e) {
      console.error("Error calculating estimated veNEAR:", e);
    }

    return "0";
  }, [
    conversionRates.liNearPrice,
    conversionRates.stNearPrice,
    lockAmount,
    selectedToken,
  ]);

  const onTokenSelectedCallback = useCallback(
    (token: TokenBalance) => {
      setSelectedToken(token);
      onTokenSelected?.(token);
    },
    [onTokenSelected]
  );

  const isInitializing =
    isLoadingVenearConfig ||
    isLoadingVeNearAccount ||
    isLoadingLockupAccount ||
    isLoadingFungibleTokens ||
    isLoadingNearBalance ||
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

            if (token.contract_id === lockupAccountId) {
              return {
                type: "lockup",
                contractId: lockupAccountId,
                symbol: "NEAR",
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

  // Select the first token by default
  useEffect(() => {
    if (!selectedToken && availableTokens.length > 0) {
      // Find the first non-zero balance
      const nonZeroBalanceToken = availableTokens.find(
        (token) => token.balance && Number(token.balance) > 0
      );

      console.log(
        `nonZeroBalanceToken: ${JSON.stringify(nonZeroBalanceToken, null, 2)}`
      );

      if (nonZeroBalanceToken) {
        setSelectedToken(nonZeroBalanceToken);
      }
    }
  }, [selectedToken, availableTokens, setSelectedToken]);

  return (
    <LockProviderContext.Provider
      value={{
        venearAccountInfo,
        selectedToken,
        setSelectedToken: onTokenSelectedCallback,
        availableTokens,
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
        stNearPrice: conversionRates.stNearPrice ?? null,
        liNearPrice: conversionRates.liNearPrice ?? null,
        lockApy,
        lockAmount,
        setLockAmount: updateLockAmount,
        isLockingMax,
        onLockMax,
        availableToLock: selectedToken?.balance ?? "0",
        lockNear,
        isLockingNear,
        lockingNearError,
        venearAmount,
      }}
    >
      {children}
    </LockProviderContext.Provider>
  );
};
