import { useCallback, useState } from "react";
import { useNear } from "@/contexts/NearContext";
import { useRegisterLockup } from "@/hooks/useRegisterLockup";
import { useSelectStakingPool } from "@/hooks/useSelectStakingPool";
import { useRefreshStakingPoolBalance } from "@/hooks/useRefreshStakingPoolBalance";
import {
  LockTransaction,
  useLockProviderContext,
} from "@/components/Dialogs/LockProvider";
import { useQueryClient } from "@tanstack/react-query";
import { FUNGIBLE_TOKEN_QK } from "./useFungibleTokens";
import { NEAR_BALANCE_QK } from "./useNearBalance";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";

export const useTransactionExecution = () => {
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

  const getTransactionText = useCallback((step: LockTransaction) => {
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
        return "Locking NEAR...";
    }
  }, []);

  const executeTransaction = useCallback(
    async (transaction: LockTransaction) => {
      switch (transaction) {
        case "deploy_lockup":
          await registerAndDeployLockupAsync(
            storageDepositAmount ?? "",
            lockupDeploymentCost ?? ""
          );
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
    ]
  );

  const queryClient = useQueryClient();

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
        TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        "ft_balance_of",
      ],
    });
  }, [queryClient, lockupAccountId]);

  const executeTransactions = useCallback(
    async ({ numTransactions }: { numTransactions: number }) => {
      try {
        setNumTransactions(numTransactions);
        setIsSubmitting(true);
        for (let i = 0; i < requiredTransactions.length; i++) {
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

  return {
    transactionText,
    transactionStep,
    numTransactions,
    isSubmitting,
    isCompleted,
    executeTransactions,
    error:
      registerAndDeployLockupError ||
      selectStakingPoolError ||
      refreshStakingPoolBalanceError ||
      lockingNearError ||
      error,
  };
};
