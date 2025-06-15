import { useNear } from "@/contexts/NearContext";
import { useWriteHOSContract } from "./useWriteHOSContract";

import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useCallback, useMemo } from "react";

type Props = {
  onSuccess?: () => void;
};

export const useRegisterLockup = ({ onSuccess }: Props) => {
  const { signedAccountId } = useNear();

  const onRegisterLockupSuccess = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const {
    mutate: registerMutation,
    mutateAsync: registerMutationAsync,
    isPending,
    error,
  } = useWriteHOSContract({
    contractType: "VENEAR",
    onSuccess: onRegisterLockupSuccess,
  });

  const registerAndDeployLockup = useCallback(
    (storageDepositAmount: string, lockupDeploymentCost: string) => {
      registerMutation({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "storage_deposit",
            args: { account_id: signedAccountId },
            deposit: storageDepositAmount,
          },
          {
            methodName: "deploy_lockup",
            args: {},
            deposit: lockupDeploymentCost,
          },
        ],
      });
    },
    [registerMutation, signedAccountId]
  );

  const registerAndDeployLockupAsync = useCallback(
    (storageDepositAmount: string, lockupDeploymentCost: string) => {
      return registerMutationAsync({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "storage_deposit",
            args: { account_id: signedAccountId },
            deposit: storageDepositAmount,
          },
          {
            methodName: "deploy_lockup",
            args: {},
            deposit: lockupDeploymentCost,
          },
        ],
      });
    },
    [registerMutationAsync, signedAccountId]
  );

  return useMemo(() => {
    return {
      registerAndDeployLockup,
      registerAndDeployLockupAsync,
      isPending,
      error,
    };
  }, [registerAndDeployLockup, registerAndDeployLockupAsync, isPending, error]);
};
