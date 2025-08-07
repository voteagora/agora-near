import { useNear } from "@/contexts/NearContext";
import { useAvailableToLock } from "@/hooks/useAvailableToLock";
import { useBalance } from "@/hooks/useBalance";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useLockNear } from "@/hooks/useLockNear";
import { useStakingPool } from "@/hooks/useStakingPool";
import { useVenearSnapshot } from "@/hooks/useVenearSnapshot";
import {
  DEFAULT_GAS_RESERVE,
  LINEAR_TOKEN_CONTRACTS,
  LINEAR_TOKEN_METADATA,
  NEAR_TOKEN_METADATA,
  STNEAR_TOKEN_CONTRACTS,
  STNEAR_TOKEN_METADATA,
} from "@/lib/constants";
import { getAPYFromGrowthRate } from "@/lib/lockUtils";
import { TokenWithBalance } from "@/lib/types";
import { isValidNearAmount } from "@/lib/utils";
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
import { LockDialogSource } from "./LockDialog/index";

export type LockTransaction =
  | "deploy_lockup"
  | "transfer_near"
  | "transfer_ft"
  | "select_staking_pool"
  | "refresh_balance"
  | "lock_near";

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
  lockNear: ({ amount }: { amount?: string }) => Promise<void>;
  isLockingNear: boolean;
  lockingNearError: Error | null;
  venearAmount?: string;
  stakingPoolId?: string | null;
  depositTotal: string;
  requiredTransactions: LockTransaction[];
  transferAmountYocto?: string;
  getAmountToLock: () => Promise<string | undefined>;
  maxAmountToLock?: string;
  amountError: string | null;
  resetForm: () => void;
  source: LockDialogSource;
  venearStorageCost: string;
  lockupStorageCost: string;
  venearAccountLockupVersion: number | undefined;
  venearGlobalLockupVersion: number | undefined;
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
  lockNear: () => Promise.resolve(),
  isLockingNear: false,
  lockingNearError: null,
  venearAmount: undefined,
  stakingPoolId: undefined,
  depositTotal: "0",
  requiredTransactions: [],
  transferAmountYocto: "0",
  getAmountToLock: () => Promise.resolve("0"),
  amountError: null,
  resetForm: () => {},
  source: "onboarding",
  venearStorageCost: "0",
  lockupStorageCost: "0",
  venearAccountLockupVersion: undefined,
  venearGlobalLockupVersion: undefined,
});

export const useLockProviderContext = () => {
  return useContext(LockProviderContext);
};

type LockProviderProps = {
  children: React.ReactNode;
  onTokenSelected?: (token: TokenWithBalance) => void;
  onLockSuccess?: () => void;
  source: LockDialogSource;
  preSelectedTokenId?: string;
};

export const LockProvider = ({
  children,
  onTokenSelected,
  onLockSuccess,
  source,
  preSelectedTokenId,
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

  const [selectedToken, setSelectedToken] = useState<
    TokenWithBalance | undefined
  >();

  const [enteredAmount, setEnteredAmount] = useState<string>("");
  const [isLockingMax, setIsLockingMax] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string | null>(null);

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
    totalRegistrationCost,
    lockupVersion: veNearLockupVersion,
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
    refetchAvailableToLock,
    isLoadingAvailableToLock,
  } = useAvailableToLock({
    lockupAccountId,
    enabled: !!venearAccountInfo,
  });

  const venearAmount = useMemo(() => {
    if (!isValidNearAmount(enteredAmount) || !selectedToken) {
      return "0";
    }

    try {
      if (selectedToken.type !== "lst") {
        return utils.format.parseNearAmount(enteredAmount) || "0";
      }

      if (
        selectedToken.accountId === stNearTokenContractId &&
        stakingPools.stNear.price
      ) {
        // Convert stNEAR to NEAR using the rate
        let valueInNear = new Big(enteredAmount).times(
          stakingPools.stNear.price
        );

        // If the user is deploying the lockup, they will also get voting power from the deposit
        if (!venearAccountInfo) {
          valueInNear = valueInNear.plus(Big(totalRegistrationCost.toString()));
        }

        return valueInNear.toFixed(0);
      }

      if (
        selectedToken.accountId === linearTokenContractId &&
        stakingPools.liNear.price
      ) {
        // Convert liNEAR to NEAR using the rate
        let valueInNear = new Big(enteredAmount).times(
          stakingPools.liNear.price
        );

        // If the user is deploying the lockup, they will also get voting power from the deposit
        if (!venearAccountInfo) {
          valueInNear = valueInNear.plus(Big(totalRegistrationCost.toString()));
        }

        return valueInNear.toFixed(0);
      }
    } catch (e) {
      console.error("Error calculating estimated veNEAR:", e);
    }

    return "0";
  }, [
    enteredAmount,
    selectedToken,
    stNearTokenContractId,
    stakingPools.stNear.price,
    stakingPools.liNear.price,
    linearTokenContractId,
    venearAccountInfo,
    totalRegistrationCost,
  ]);

  const onTokenSelectedCallback = useCallback(
    (token: TokenWithBalance) => {
      setSelectedToken(token);
      onTokenSelected?.(token);
    },
    [onTokenSelected]
  );

  const { stakingPoolId } = useCurrentStakingPoolId({
    lockupAccountId: lockupAccountId ?? "",
    enabled: !!venearAccountInfo,
  });

  const isInitializing =
    isLoadingVenearConfig ||
    isLoadingVeNearAccount ||
    isLoadingLockupAccount ||
    isLoadingFungibleTokens ||
    isLoadingNearBalance ||
    isLoadingStakingPools;

  const availableTokens = useMemo(() => {
    if (
      isLoadingNearBalance ||
      isLoadingAvailableToLock ||
      isLoadingFungibleTokens
    ) {
      return [];
    }

    const tokens: TokenWithBalance[] = [];

    if (availableToLockInLockup && Big(availableToLockInLockup).gt(0)) {
      tokens.push({
        type: "lockup" as const,
        metadata: NEAR_TOKEN_METADATA,
        accountId: lockupAccountId,
        balance: availableToLockInLockup,
      });
    }

    if (nearBalance && Big(nearBalance).gt(0)) {
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
          .filter((token) => token && token.balance && Big(token.balance).gt(0))
          .map((token) => {
            if (token.contract_id === linearTokenContractId) {
              return {
                type: "lst" as const,
                accountId: linearTokenContractId,
                metadata: LINEAR_TOKEN_METADATA,
                balance: token.balance,
              };
            }

            if (token.contract_id === stNearTokenContractId) {
              return {
                type: "lst" as const,
                accountId: stNearTokenContractId,
                metadata: STNEAR_TOKEN_METADATA,
                balance: token.balance,
              };
            }

            return null;
          })
          .filter((token) => token !== null)
      );
    }

    return tokens.sort((a, b) => (Big(b.balance).gt(a.balance) ? 1 : -1));
  }, [
    availableToLockInLockup,
    fungibleTokensResponse,
    isLoadingAvailableToLock,
    isLoadingFungibleTokens,
    isLoadingNearBalance,
    linearTokenContractId,
    lockupAccountId,
    nearBalance,
    signedAccountId,
    stNearTokenContractId,
  ]);

  const maxLiquidNearAvailable = useMemo(() => {
    if (!nearBalance || Big(nearBalance).lte(DEFAULT_GAS_RESERVE)) {
      return "0";
    }

    return Big(nearBalance).minus(Big(DEFAULT_GAS_RESERVE)).toFixed(0);
  }, [nearBalance]);

  const maxAmountToLock = useMemo(
    () =>
      selectedToken?.type === "near"
        ? maxLiquidNearAvailable
        : selectedToken?.balance,
    [maxLiquidNearAvailable, selectedToken?.balance, selectedToken?.type]
  );

  const depositTotal = useMemo(() => {
    let totalDeposit = Big(0);

    if (!venearAccountInfo) {
      totalDeposit = totalDeposit.plus(
        new Big(totalRegistrationCost.toString())
      );
    }

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
    venearAccountInfo,
  ]);

  const maxAmountToLockNear = useMemo(() => {
    return utils.format.formatNearAmount(maxAmountToLock ?? "0");
  }, [maxAmountToLock]);

  const validateAmount = useCallback(
    (amount: string) => {
      try {
        if (!isValidNearAmount(amount)) {
          setAmountError("Please enter a valid amount");
        } else if (
          Big(utils.format.parseNearAmount(amount) ?? "0").gt(
            Big(maxAmountToLock ?? "0")
          )
        ) {
          setAmountError("Not enough funds in this account");
        } else if (
          selectedToken?.type === "near" &&
          Big(utils.format.parseNearAmount(amount) ?? "0").lt(depositTotal)
        ) {
          setAmountError(
            `You must lock at least ${utils.format.formatNearAmount(depositTotal)} NEAR`
          );
        } else {
          setAmountError(null);
        }
      } catch (e) {
        setAmountError("Invalid amount");
      }
    },
    [depositTotal, maxAmountToLock, selectedToken?.type]
  );

  const resetForm = useCallback(() => {
    setEnteredAmount("");
    setAmountError(null);
    setIsLockingMax(false);
  }, []);

  const onLockMax = useCallback(() => {
    setEnteredAmount(maxAmountToLockNear);
    setIsLockingMax(true);
    validateAmount(maxAmountToLockNear);
  }, [maxAmountToLockNear, validateAmount]);

  const onEnteredAmountUpdated = useCallback(
    (amount: string) => {
      setEnteredAmount(amount);
      setIsLockingMax(false);
      validateAmount(amount);
    },
    [validateAmount]
  );

  const enteredAmountYocto = useMemo(() => {
    if (!isValidNearAmount(enteredAmount)) {
      return "0";
    }

    return utils.format.parseNearAmount(enteredAmount) || "0";
  }, [enteredAmount]);

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

  const transferAmountYocto = useMemo(() => {
    if (selectedToken?.type === "lst") {
      return enteredAmountYocto;
    }

    if (selectedToken?.type === "near") {
      let amount = Big(enteredAmountYocto);

      // If coming from onboarding, we factor in the deposit that we've already made
      if (source === "onboarding") {
        amount = amount.minus(Big(totalRegistrationCost.toString()));
      }

      return amount.lte(0) ? "0" : amount.toFixed(0);
    }
  }, [enteredAmountYocto, selectedToken?.type, source, totalRegistrationCost]);

  const getAmountToLock = useCallback(async () => {
    // Lock all when onboarding
    if (source === "onboarding") {
      return undefined;
    }

    const { data: liquidNearInLockup } = await refetchAvailableToLock();

    const targetLockAmount =
      selectedToken?.type === "lst" ? venearAmount : enteredAmountYocto;

    // For sanity, return min of available to lock and desired amount
    return Big(targetLockAmount ?? "0").lt(Big(liquidNearInLockup ?? "0"))
      ? targetLockAmount
      : liquidNearInLockup;
  }, [
    enteredAmountYocto,
    refetchAvailableToLock,
    selectedToken?.type,
    source,
    venearAmount,
  ]);

  // Select the first token by default or the pre-selected token if provided
  useEffect(() => {
    if (!selectedToken && availableTokens.length > 0) {
      let token;

      if (preSelectedTokenId) {
        token = availableTokens.find(
          (token) => token.accountId === preSelectedTokenId
        );
      }

      setSelectedToken(token ?? availableTokens[0]);
    }
  }, [selectedToken, availableTokens, setSelectedToken, preSelectedTokenId]);

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
        lockNear: lockNearAsync,
        isLockingNear,
        lockingNearError,
        venearAmount,
        stakingPoolId,
        depositTotal,
        requiredTransactions,
        totalRegistrationCost: totalRegistrationCost.toString(),
        transferAmountYocto,
        getAmountToLock,
        maxAmountToLock,
        amountError,
        resetForm,
        source,
        venearStorageCost: venearStorageCost.toString(),
        lockupStorageCost: lockupStorageCost.toString(),
        venearAccountLockupVersion:
          venearAccountInfo?.lockupVersion ?? undefined,
        venearGlobalLockupVersion: veNearLockupVersion,
      }}
    >
      {children}
    </LockProviderContext.Provider>
  );
};
