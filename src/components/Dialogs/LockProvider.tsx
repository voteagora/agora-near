import { useNear } from "@/contexts/NearContext";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useLockNear } from "@/hooks/useLockNear";
import { useNearBalance } from "@/hooks/useNearBalance";
import { useStakingPool } from "@/hooks/useStakingPool";
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
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { venearMethodConfig } from "@/lib/contracts/config/methods/venear";
import { convertUnit } from "@fastnear/utils";
import { lockupMethodConfig } from "@/lib/contracts/config/methods/lockup";
import { useAvailableToLock } from "@/hooks/useAvailableToLock";

export type LockTransaction =
  | "deploy_lockup"
  | "transfer_near"
  | "transfer_ft"
  | "select_staking_pool"
  | "refresh_balance"
  | "lock_near";

const gasFees: Record<LockTransaction, string> = {
  deploy_lockup: convertUnit(
    venearMethodConfig["deploy_lockup"].gas ?? "30 Tgas"
  ),
  select_staking_pool: convertUnit(
    lockupMethodConfig["select_staking_pool"].gas ?? "30 Tgas"
  ),
  refresh_balance: convertUnit(
    lockupMethodConfig["refresh_staking_pool_balance"].gas ?? "30 Tgas"
  ),
  lock_near: convertUnit(lockupMethodConfig["lock_near"].gas ?? "30 Tgas"),
  transfer_near: convertUnit("30 Tgas"),
  transfer_ft: convertUnit("30 Tgas"),
};

type LockProviderContextType = {
  isLoading: boolean;
  error: Error | null;
  lockupAccountId: string | null;
  storageDepositAmount: string | null;
  lockupDeploymentCost: string | null;
  totalRegistrationCost: string | null;
  selectedToken?: TokenWithBalance;
  setSelectedToken: (token: TokenWithBalance) => void;
  availableTokens: TokenWithBalance[];
  venearAccountInfo?: ReturnType<typeof useVenearAccountInfo>["data"];
  lockApy: string;
  enteredAmount: string;
  setEnteredAmount: (amount: string) => void;
  isLockingMax: boolean;
  onLockMax: () => void;
  availableToLock: string;
  lockNear: ({ amount }: { amount?: string }) => Promise<void>;
  isLockingNear: boolean;
  lockingNearError: Error | null;
  venearAmount?: string;
  stakingPoolId?: string | null;
  depositTotal: string;
  gasTotal: string;
  requiredTransactions: LockTransaction[];
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
  totalRegistrationCost: null,
  venearAccountInfo: undefined,
  lockApy: "",
  enteredAmount: "",
  setEnteredAmount: () => {},
  isLockingMax: false,
  onLockMax: () => {},
  availableToLock: "0",
  lockNear: () => Promise.resolve(),
  isLockingNear: false,
  lockingNearError: null,
  venearAmount: undefined,
  stakingPoolId: undefined,
  depositTotal: "0",
  gasTotal: "0",
  requiredTransactions: [],
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

  const [enteredAmount, setEnteredAmount] = useState<string>("");
  const [isLockingMax, setIsLockingMax] = useState<boolean>(false);

  const onLockMax = useCallback(() => {
    if (selectedToken?.balance) {
      setEnteredAmount(selectedToken?.balance);
      setIsLockingMax(true);
    }
  }, [selectedToken?.balance]);

  const onEnteredAmountUpdated = useCallback(
    (amount: string) => {
      setEnteredAmount(amount);
      setIsLockingMax(false);
    },
    [setIsLockingMax]
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
    totalRegistrationCost,
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

  const { lockNearAsync, isLockingNear, lockingNearError } = useLockNear({
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

  const { stakingPools, isLoading: isLoadingStakingPools } = useStakingPool();

  const {
    availableToLock: availableToLockInLockup,
    isLoadingAvailableToLock: isLoadingAvailableToLockInLockup,
  } = useAvailableToLock({
    lockupAccountId,
    enabled: !!venearAccountInfo,
  });

  const venearAmount = useMemo(() => {
    if (!enteredAmount || !selectedToken) return "0";

    try {
      if (selectedToken.type === "near") {
        return utils.format.parseNearAmount(enteredAmount) || "0";
      } else if (
        selectedToken.accountId === stNearTokenContractId &&
        stakingPools.stNear.price
      ) {
        // Convert stNEAR to NEAR using the rate
        const valueInNear = new Big(enteredAmount).times(
          stakingPools.stNear.price
        );
        return valueInNear.toFixed(0);
      } else if (
        selectedToken.accountId === linearTokenContractId &&
        stakingPools.liNear.price
      ) {
        // Convert liNEAR to NEAR using the rate
        const valueInNear = new Big(enteredAmount).times(
          stakingPools.liNear.price
        );
        return valueInNear.toFixed(0);
      }
    } catch (e) {
      console.error("Error calculating estimated veNEAR:", e);
    }

    return "0";
  }, [
    linearTokenContractId,
    enteredAmount,
    selectedToken,
    stNearTokenContractId,
    stakingPools.liNear.price,
    stakingPools.stNear.price,
  ]);

  const onTokenSelectedCallback = useCallback(
    (token: TokenWithBalance) => {
      setSelectedToken(token);
      onTokenSelected?.(token);
    },
    [onTokenSelected]
  );

  const { stakingPoolId, isLoadingStakingPoolId } = useCurrentStakingPoolId({
    lockupAccountId: lockupAccountId ?? "",
    enabled: !!venearAccountInfo,
  });

  const isInitializing =
    isLoadingVenearConfig ||
    isLoadingVeNearAccount ||
    isLoadingLockupAccount ||
    isLoadingFungibleTokens ||
    isLoadingNearBalance ||
    isLoadingStakingPools ||
    isLoadingStakingPoolId ||
    isLoadingAvailableToLockInLockup;

  const availableTokens = useMemo(() => {
    const tokens: TokenWithBalance[] = [];

    if (availableToLockInLockup) {
      tokens.push({
        type: "lockup" as const,
        metadata: NEAR_TOKEN_METADATA,
        accountId: lockupAccountId,
        balance: availableToLockInLockup,
      });
    }

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

            return null;
          })
          .filter((token) => token !== null)
      );
    }

    return tokens;
  }, [
    availableToLockInLockup,
    fungibleTokensResponse,
    linearTokenContractId,
    linearTokenMetadata,
    lockupAccountId,
    nearBalance,
    signedAccountId,
    stNearTokenContractId,
    stNearTokenMetadata,
  ]);

  const requiredTransactions = useMemo(() => {
    const transactions: LockTransaction[] = [];

    if (!venearAccountInfo) {
      // Requires deploying lockup
      transactions.push("deploy_lockup");
    }

    if (selectedToken?.type === "lst" && !stakingPoolId) {
      transactions.push("select_staking_pool");
    }

    if (selectedToken?.type !== "lockup") {
      // Requires transferring tokens to lockup
      transactions.push(
        selectedToken?.type === "near" ? "transfer_near" : "transfer_ft"
      );
    }

    if (selectedToken?.type === "lst") {
      // LST requires refreshing balance
      transactions.push("refresh_balance");
    }

    transactions.push("lock_near");

    return transactions;
  }, [selectedToken?.type, stakingPoolId, venearAccountInfo]);

  const gasTotal = useMemo(() => {
    let totalGas = new Big(0);

    for (const transaction of requiredTransactions) {
      totalGas = totalGas.plus(new Big(gasFees[transaction] ?? "0"));
    }

    return totalGas.toFixed();
  }, [requiredTransactions]);

  const depositTotal = useMemo(() => {
    let totalDeposit = new Big(totalRegistrationCost.toString());

    if (
      selectedToken?.type === "lst" &&
      selectedToken.accountId === stNearTokenContractId
    ) {
      totalDeposit = totalDeposit.plus(
        new Big(stakingPools.stNear.deposit?.min ?? "0")
      );
    }

    if (
      selectedToken?.type === "lst" &&
      selectedToken.accountId === linearTokenContractId
    ) {
      totalDeposit = totalDeposit.plus(
        new Big(stakingPools.liNear.deposit?.min ?? "0")
      );
    }

    return totalDeposit.toFixed();
  }, [
    linearTokenContractId,
    selectedToken?.accountId,
    selectedToken?.type,
    stNearTokenContractId,
    stakingPools.liNear.deposit?.min,
    stakingPools.stNear.deposit?.min,
    totalRegistrationCost,
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
        lockApy,
        enteredAmount,
        setEnteredAmount: onEnteredAmountUpdated,
        isLockingMax,
        onLockMax,
        availableToLock: selectedToken?.balance ?? "0",
        lockNear: lockNearAsync,
        isLockingNear,
        lockingNearError,
        venearAmount,
        stakingPoolId,
        depositTotal,
        gasTotal,
        requiredTransactions,
        totalRegistrationCost: totalRegistrationCost.toString(),
      }}
    >
      {children}
    </LockProviderContext.Provider>
  );
};
