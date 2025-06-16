import { useNear } from "@/contexts/NearContext";
import { useAvailableToUnlock } from "@/hooks/useAvailableToUnlock";
import { useUnlockNear } from "@/hooks/useUnlockNear";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { isValidNearAmount } from "@/lib/utils";
import Big from "big.js";
import { utils } from "near-api-js";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

type UnlockProviderContextType = {
  isLoading: boolean;
  error: Error | null;
  lockupAccountId: string | null;
  availableToUnlock: string | null;
  enteredAmount: string;
  setEnteredAmount: (amount: string) => void;
  isUnlockingMax: boolean;
  onUnlockMax: () => void;
  unlockNear: ({ amount }: { amount?: string }) => Promise<void>;
  isUnlockingNear: boolean;
  unlockingNearError: Error | null;
  maxAmountToUnlock: string;
  amountError: string | null;
  resetForm: () => void;
  nearAmount: string;
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
  unlockNear: () => Promise.resolve(),
  isUnlockingNear: false,
  unlockingNearError: null,
  maxAmountToUnlock: "0",
  amountError: null,
  resetForm: () => {},
  nearAmount: "0",
});

export const useUnlockProviderContext = () => {
  return useContext(UnlockProviderContext);
};

type UnlockProviderProps = {
  children: React.ReactNode;
  onUnlockSuccess?: () => void;
};

export const UnlockProvider = ({
  children,
  onUnlockSuccess,
}: UnlockProviderProps) => {
  const { signedAccountId } = useNear();

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

  const { beginUnlockNear, isUnlockingNear, unlockingNearError } =
    useUnlockNear({
      lockupAccountId: lockupAccountId || "",
      onSuccess: () => {
        toast.success("Unlock successful");
        onUnlockSuccess?.();
      },
    });

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
        } else if (Big(amount).gt(Big(maxAmountToUnlockFormatted))) {
          setAmountError("Not enough veNEAR available to unlock");
        } else if (Big(amount).lte(0)) {
          setAmountError("Amount must be greater than 0");
        } else {
          setAmountError(null);
        }
      } catch (e) {
        setAmountError("Invalid amount");
      }
    },
    [maxAmountToUnlockFormatted]
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
        unlockNear: beginUnlockNear,
        isUnlockingNear,
        unlockingNearError,
        maxAmountToUnlock,
        amountError,
        resetForm,
        nearAmount,
      }}
    >
      {children}
    </UnlockProviderContext.Provider>
  );
};
