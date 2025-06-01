import { useCallback, useState } from "react";
import { useNear } from "@/contexts/NearContext";
import { useRegisterLockup } from "@/hooks/useRegisterLockup";
import { useSelectStakingPool } from "@/hooks/useSelectStakingPool";
import { useRefreshStakingPoolBalance } from "@/hooks/useRefreshStakingPoolBalance";
import {
  LockTransaction,
  useLockProviderContext,
} from "@/components/Dialogs/LockProvider";

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
  } = useLockProviderContext();

  const [transactionText, setTransactionText] = useState<string>("");
  const [transactionStep, setTransactionStep] = useState<number>(0);
  const [numTransactions, setNumTransactions] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { transferNear, transferFungibleToken } = useNear();

  const { registerAndDeployLockupAsync } = useRegisterLockup({});

  const { selectStakingPoolAsync } = useSelectStakingPool({
    lockupAccountId: lockupAccountId ?? "",
  });

  const refreshStakingPoolBalance = useRefreshStakingPoolBalance({
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
          await refreshStakingPoolBalance();
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
      refreshStakingPoolBalance,
      registerAndDeployLockupAsync,
      selectStakingPoolAsync,
      selectedToken?.accountId,
      storageDepositAmount,
      transferAmountYocto,
      transferFungibleToken,
      transferNear,
    ]
  );

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
      } catch (e) {
        console.error(`Error executing transaction: ${JSON.stringify(e)}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [requiredTransactions, getTransactionText, executeTransaction]
  );

  return {
    transactionText,
    transactionStep,
    numTransactions,
    isSubmitting,
    isCompleted,
    executeTransactions,
  };
};
