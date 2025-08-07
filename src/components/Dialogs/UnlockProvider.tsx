import { useAvailableToUnlock } from "@/hooks/useAvailableToUnlock";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useVenearConfig } from "@/hooks/useVenearConfig";
import { formatNanoSecondsToTimeUnit, isValidNearAmount } from "@/lib/utils";
import Big from "big.js";
import { utils } from "near-api-js";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type UnlockProviderContextType = {
  isLoading: boolean;
  error: Error | null;
  lockupAccountId: string | null;
  availableToUnlock: string | null;
  enteredAmount: string;
  setEnteredAmount: (amount: string) => void;
  isUnlockingMax: boolean;
  onUnlockMax: () => void;
  maxAmountToUnlock: string;
  amountError: string | null;
  resetForm: () => void;
  nearAmount: string;
  formattedUnlockDuration: string;
};

export const UnlockProviderContext = createContext<UnlockProviderContextType>({
  isLoading: false,
  error: null,
  lockupAccountId: null,
  availableToUnlock: null,
  enteredAmount: "",
  setEnteredAmount: () => {},
  isUnlockingMax: false,
  onUnlockMax: () => {},
  maxAmountToUnlock: "0",
  amountError: null,
  resetForm: () => {},
  nearAmount: "0",
  formattedUnlockDuration: "0",
});

export const useUnlockProviderContext = () => {
  return useContext(UnlockProviderContext);
};

type UnlockProviderProps = {
  children: React.ReactNode;
};

export const UnlockProvider = ({ children }: UnlockProviderProps) => {
  const [enteredAmount, setEnteredAmount] = useState<string>("");
  const [isUnlockingMax, setIsUnlockingMax] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  const {
    lockupAccountId,
    isLoading: isLoadingLockupAccount,
    error: lockupAccountError,
  } = useLockupAccount();

  const { availableToUnlock, isLoading: isLoadingAvailableToUnlock } =
    useAvailableToUnlock({
      lockupAccountId: lockupAccountId || "",
    });

  const { unlockDuration } = useVenearConfig({ enabled: true });

  const isInitializing = isLoadingLockupAccount || isLoadingAvailableToUnlock;

  const maxAmountToUnlock = useMemo(() => {
    return availableToUnlock || "0";
  }, [availableToUnlock]);

  const maxAmountToUnlockFormatted = useMemo(() => {
    return utils.format.formatNearAmount(maxAmountToUnlock);
  }, [maxAmountToUnlock]);

  // 1:1 conversion - unlocking veNEAR gives you NEAR
  const nearAmount = useMemo(() => {
    if (!isValidNearAmount(enteredAmount)) {
      return "0";
    }
    return utils.format.parseNearAmount(enteredAmount) || "0";
  }, [enteredAmount]);

  const validateAmount = useCallback(
    (amount: string) => {
      try {
        if (!isValidNearAmount(amount)) {
          setAmountError("Please enter a valid amount");
        } else if (
          Big(utils.format.parseNearAmount(amount) ?? "0").gt(
            Big(maxAmountToUnlock ?? "0")
          )
        ) {
          setAmountError("Not enough veNEAR available to unlock");
        } else if (Big(utils.format.parseNearAmount(amount) ?? "0").lte(0)) {
          setAmountError("Amount must be greater than 0");
        } else {
          setAmountError(null);
        }
      } catch (e) {
        setAmountError("Invalid amount");
      }
    },
    [maxAmountToUnlock]
  );

  const resetForm = useCallback(() => {
    setEnteredAmount("");
    setAmountError(null);
    setIsUnlockingMax(false);
  }, []);

  const onUnlockMax = useCallback(() => {
    setEnteredAmount(maxAmountToUnlockFormatted);
    setIsUnlockingMax(true);
    validateAmount(maxAmountToUnlockFormatted);
  }, [maxAmountToUnlockFormatted, validateAmount]);

  const onEnteredAmountUpdated = useCallback(
    (amount: string) => {
      setEnteredAmount(amount);
      setIsUnlockingMax(false);
      validateAmount(amount);
    },
    [validateAmount]
  );

  const formattedUnlockDuration = useMemo(() => {
    return formatNanoSecondsToTimeUnit(unlockDuration.toString());
  }, [unlockDuration]);

  return (
    <UnlockProviderContext.Provider
      value={{
        isLoading: isInitializing,
        error: lockupAccountError,
        lockupAccountId: lockupAccountId ?? null,
        availableToUnlock: availableToUnlock ?? null,
        enteredAmount,
        setEnteredAmount: onEnteredAmountUpdated,
        isUnlockingMax,
        onUnlockMax,
        maxAmountToUnlock,
        amountError,
        resetForm,
        nearAmount,
        formattedUnlockDuration,
      }}
    >
      {children}
    </UnlockProviderContext.Provider>
  );
};
