import { useCallback, useMemo, useState } from "react";
import { useNear } from "@/contexts/NearContext";
import { useRegisterLockup } from "@/hooks/useRegisterLockup";
import { useSelectStakingPool } from "@/hooks/useSelectStakingPool";
import { useRefreshStakingPoolBalance } from "@/hooks/useRefreshStakingPoolBalance";
import {
  LockTransaction,
  useLockProviderContext,
} from "@/components/Dialogs/LockProvider";
import { useQueryClient } from "@tanstack/react-query";
import { NEAR_ACCOUNT_EXISTS_QK } from "./useAccountExists";
import { FUNGIBLE_TOKEN_QK } from "./useFungibleTokens";
import { NEAR_BALANCE_QK } from "./useBalance";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";

export const useDeployLockupAndLock = () => {
  const {
    lockupAccountId,
    selectedToken,
    storageDepositAmount,
    lockupDeploymentCost,
    transferAmountYocto = "0",
    requiredTransactions,
    lockNear,
    getAmountToLock,
    lockingNearError,
  } = useLockProviderContext();

  const [transactionText, setTransactionText] = useState<string>("");
  const [transactionStep, setTransactionStep] = useState<number>(0);
  const [numTransactions, setNumTransactions] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { transferNear, transferFungibleToken } = useNear();

  const { registerAndDeployLockupAsync, error: registerAndDeployLockupError } =
    useRegisterLockup({});

  const { selectStakingPoolAsync, error: selectStakingPoolError } =
    useSelectStakingPool({
      lockupAccountId: lockupAccountId ?? "",
    });

  const {
    refreshStakingPoolBalanceAsync,
    error: refreshStakingPoolBalanceError,
  } = useRefreshStakingPoolBalance({
    lockupAccountId: lockupAccountId ?? "",
  });

  const queryClient = useQueryClient();

  const getTransactionText = useCallback(
    (step: LockTransaction) => {
      switch (step) {
        case "deploy_lockup":
          return "Deploying lockup contract...";
        case "transfer_near":
        case "transfer_ft":
          return "Transferring tokens...";
        case "select_staking_pool":
          return "Selecting staking pool...";
        case "refresh_balance":
          return "Refreshing balance...";
        case "lock_near":
          return `Locking ${selectedToken?.metadata?.name}...`;
      }
    },
    [selectedToken?.metadata?.name]
  );

  const executeTransaction = useCallback(
    async (transaction: LockTransaction) => {
      switch (transaction) {
        case "deploy_lockup":
          await registerAndDeployLockupAsync(
            storageDepositAmount ?? "",
            lockupDeploymentCost ?? ""
          );
          // Ensure subsequent attempts detect that the lockup now exists
          queryClient.invalidateQueries({
            queryKey: [NEAR_ACCOUNT_EXISTS_QK, lockupAccountId],
          });
          break;
        case "transfer_ft": {
          await transferFungibleToken({
            tokenContractId: selectedToken?.accountId ?? "",
            receiverId: lockupAccountId ?? "",
            amount: transferAmountYocto,
          });
          break;
        }
        case "transfer_near": {
          await transferNear({
            receiverId: lockupAccountId ?? "",
            amount: transferAmountYocto,
          });
          break;
        }
        case "select_staking_pool":
          await selectStakingPoolAsync({
            stakingPoolId: selectedToken?.accountId ?? "",
          });
          break;
        case "refresh_balance":
          await refreshStakingPoolBalanceAsync();
          break;
        case "lock_near": {
          const amountToLock = await getAmountToLock();
          await lockNear({
            amount: amountToLock,
          });
          break;
        }
      }
    },
    [
      getAmountToLock,
      lockNear,
      lockupAccountId,
      lockupDeploymentCost,
      refreshStakingPoolBalanceAsync,
      registerAndDeployLockupAsync,
      selectStakingPoolAsync,
      selectedToken?.accountId,
      storageDepositAmount,
      transferAmountYocto,
      transferFungibleToken,
      transferNear,
      queryClient,
    ]
  );

  const refreshBalances = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [FUNGIBLE_TOKEN_QK],
    });

    queryClient.invalidateQueries({
      queryKey: [NEAR_BALANCE_QK],
    });

    queryClient.invalidateQueries({
      queryKey: [
        READ_NEAR_CONTRACT_QK,
        lockupAccountId,
        "get_venear_liquid_balance",
      ],
    });

    queryClient.invalidateQueries({
      queryKey: [
        READ_NEAR_CONTRACT_QK,
        CONTRACTS.VENEAR_CONTRACT_ID,
        "ft_balance_of",
      ],
    });

    // Ensure account info used by Lockup Holdings ("Locked") updates immediately
    queryClient.invalidateQueries({
      queryKey: [
        READ_NEAR_CONTRACT_QK,
        CONTRACTS.VENEAR_CONTRACT_ID,
        "get_account_info",
      ],
    });

    queryClient.invalidateQueries({
      queryKey: [
        READ_NEAR_CONTRACT_QK,
        lockupAccountId,
        "get_liquid_owners_balance",
      ],
    });
  }, [queryClient, lockupAccountId]);

  const executeTransactions = useCallback(
    async ({
      numTransactions,
      startAt = 0,
    }: {
      numTransactions: number;
      startAt?: number;
    }) => {
      try {
        if (startAt < 0 || startAt >= requiredTransactions.length) {
          throw new Error("Something went wrong executing lock transactions");
        }

        setNumTransactions(numTransactions);
        setIsSubmitting(true);
        for (let i = startAt; i < requiredTransactions.length; i++) {
          const transaction = requiredTransactions[i];

          setTransactionText(getTransactionText(transaction));
          setTransactionStep(i);

          await executeTransaction(transaction);
        }

        setIsCompleted(true);
        setTransactionText("Locked");
        refreshBalances();
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      refreshBalances,
      requiredTransactions,
      getTransactionText,
      executeTransaction,
    ]
  );

  const retryFromCurrentStep = useCallback(() => {
    executeTransactions({
      numTransactions: requiredTransactions.length,
      startAt: transactionStep,
    });
  }, [executeTransactions, requiredTransactions.length, transactionStep]);

  const errorMessage = useMemo(() => {
    if (registerAndDeployLockupError) {
      return "Something went wrong deploying your lockup contract";
    }

    if (selectStakingPoolError) {
      return "Something went wrong selecting a staking pool";
    }

    if (refreshStakingPoolBalanceError) {
      return "Something went wrong refreshing your balance";
    }

    if (lockingNearError) {
      return `Something went wrong locking your ${selectedToken?.metadata?.name}`;
    }

    if (error) {
      return error.message;
    }

    return null;
  }, [
    error,
    lockingNearError,
    refreshStakingPoolBalanceError,
    registerAndDeployLockupError,
    selectStakingPoolError,
    selectedToken?.metadata?.name,
  ]);

  return {
    transactionText,
    transactionStep,
    numTransactions,
    isSubmitting,
    isCompleted,
    executeTransactions,
    error: errorMessage,
    retryFromCurrentStep,
  };
};
