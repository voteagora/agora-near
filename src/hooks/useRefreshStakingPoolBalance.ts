import { useCallback } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";

export const useRefreshStakingPoolBalance = ({
  lockupAccountId,
}: {
  lockupAccountId: string;
}) => {
  const { mutateAsync: writeLockupContract, error } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const refreshStakingPoolBalanceAsync = useCallback(async () => {
    await writeLockupContract({
      contractId: lockupAccountId,
      methodCalls: [
        {
          methodName: "refresh_staking_pool_balance",
          args: {},
        },
      ],
    });
  }, [lockupAccountId, writeLockupContract]);

  return {
    refreshStakingPoolBalanceAsync,
    error,
  };
};
