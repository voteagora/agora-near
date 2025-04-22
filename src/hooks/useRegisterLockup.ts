import { useNear } from "@/contexts/NearContext";
import { useWriteHOSContract } from "./useWriteHOSContract";

import { TESTNET_CONTRACTS } from "@/lib/near/constants";
import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "./useReadNearContract";

export const useRegisterLockup = () => {
  const { signedAccountId } = useNear();
  const queryClient = useQueryClient();

  const onRegisterLockupSuccess = useCallback(() => {
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: [
          READ_NEAR_CONTRACT_QK,
          TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
          "get_lockup_account_id",
        ],
      }),
      queryClient.invalidateQueries({
        queryKey: [
          READ_NEAR_CONTRACT_QK,
          TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
          "get_account_info",
        ],
      }),
    ]);
  }, [queryClient]);

  const {
    mutate: callMethod,
    isPending,
    error,
  } = useWriteHOSContract({
    contractType: "VENEAR",
    onSuccess: onRegisterLockupSuccess,
  });

  const registerAndDeployLockup = useCallback(
    (storageDepositAmount: string, lockupDeploymentCost: string) => {
      callMethod({
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
    [callMethod, signedAccountId]
  );

  return useMemo(() => {
    return {
      registerAndDeployLockup,
      isPending,
      error,
    };
  }, [registerAndDeployLockup, isPending, error]);
};
