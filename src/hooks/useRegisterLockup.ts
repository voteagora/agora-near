import { useNear } from "@/contexts/NearContext";
import { useWriteHOSContract } from "./useWriteHOSContract";

import { TESTNET_CONTRACTS } from "@/lib/near/constants";
import { useCallback, useMemo } from "react";

export const useRegisterLockup = () => {
  const { signedAccountId } = useNear();

  const {
    mutate: callMethod,
    isPending,
    error,
  } = useWriteHOSContract({
    contractType: "VENEAR",
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
