import { useNear } from "@/contexts/NearContext";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useLockNear } from "@/hooks/useLockNear";
import { useNearBalance } from "@/hooks/useNearBalance";
import { useStakingPoolConversionRates } from "@/hooks/useStakingPoolConversionRates";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { useVenearSnapshot } from "@/hooks/useVenearSnapshot";
import {
  LINEAR_TOKEN_CONTRACTS,
  NEAR_TOKEN_METADATA,
  STNEAR_TOKEN_CONTRACTS,
} from "@/lib/constants";
import { getAPYFromGrowthRate } from "@/lib/lockUtils";
import { TokenWithBalance } from "@/lib/types";
import Big from "big.js";
import { utils } from "near-api-js";
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

type LockProviderContextType = {
  isLoading: boolean;
  error: Error | null;
  lockupAccountId: string | null;
  storageDepositAmount: string | null;
  lockupDeploymentCost: string | null;
  selectedToken?: TokenWithBalance;
  setSelectedToken: (token: TokenWithBalance) => void;
  availableTokens: TokenWithBalance[];
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
  onTokenSelected?: (token: TokenWithBalance) => void;
  onLockSuccess?: () => void;
};

export const LockProvider = ({
  children,
  onTokenSelected,
  onLockSuccess,
}: LockProviderProps) => {
  const { signedAccountId, networkId } = useNear();

  const linearTokenContractId = useMemo(
    () => LINEAR_TOKEN_CONTRACTS[networkId],
    [networkId]
  );

  const stNearTokenContractId = useMemo(
    () => STNEAR_TOKEN_CONTRACTS[networkId],
    [networkId]
  );

  const { metadata: linearTokenMetadata } = useTokenMetadata({
    contractId: linearTokenContractId,
  });

  const { metadata: stNearTokenMetadata } = useTokenMetadata({
    contractId: stNearTokenContractId,
  });

  const [selectedToken, setSelectedToken] = useState<
    TokenWithBalance | undefined
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
        selectedToken.accountId === stNearTokenContractId &&
        conversionRates.stNearPrice
      ) {
        // Convert stNEAR to NEAR using the rate
        const valueInNear = new Big(lockAmount).times(
          conversionRates.stNearPrice
        );
        return valueInNear.toFixed(0);
      } else if (
        selectedToken.accountId === linearTokenContractId &&
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
    linearTokenContractId,
    lockAmount,
    selectedToken,
    stNearTokenContractId,
  ]);

  const onTokenSelectedCallback = useCallback(
    (token: TokenWithBalance) => {
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
    const tokens: TokenWithBalance[] = [];

    if (nearBalance) {
      tokens.push({
        type: "near",
        metadata: NEAR_TOKEN_METADATA,
        balance: nearBalance,
        accountId: signedAccountId,
      });
    }

    if (fungibleTokensResponse) {
      tokens.push(
        ...fungibleTokensResponse.tokens
          .map((token) => {
            if (token.contract_id === linearTokenContractId) {
              return {
                type: "lst" as const,
                accountId: linearTokenContractId,
                metadata: linearTokenMetadata,
                balance: token.balance,
              };
            }

            if (token.contract_id === stNearTokenContractId) {
              return {
                type: "lst" as const,
                accountId: stNearTokenContractId,
                metadata: stNearTokenMetadata,
                balance: token.balance,
              };
            }

            if (token.contract_id === lockupAccountId) {
              return {
                type: "lockup" as const,
                metadata: NEAR_TOKEN_METADATA,
                accountId: lockupAccountId,
                balance: token.balance,
              };
            }

            return null;
          })
          .filter((token) => token !== null)
      );
    }

    return tokens;
  }, [
    fungibleTokensResponse,
    linearTokenContractId,
    linearTokenMetadata,
    lockupAccountId,
    nearBalance,
    signedAccountId,
    stNearTokenContractId,
    stNearTokenMetadata,
  ]);

  // Select the first token by default
  useEffect(() => {
    if (!selectedToken && availableTokens.length > 0) {
      // Find the first non-zero balance
      const nonZeroBalanceToken = availableTokens.find(
        (token) => token.balance && Number(token.balance) > 0
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
