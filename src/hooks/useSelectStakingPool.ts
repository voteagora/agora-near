import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

export const useSelectStakingPool = ({
  lockupAccountId,
}: {
  lockupAccountId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: mutateLockupAsync, error } = useWriteHOSContract({
    contractType: "LOCKUP",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          READ_NEAR_CONTRACT_QK,
          lockupAccountId,
          "get_staking_pool_account_id",
        ],
      });
    },
  });

  const selectStakingPoolAsync = useCallback(
    ({ stakingPoolId }: { stakingPoolId: string }) => {
      return mutateLockupAsync({
        contractId: lockupAccountId,
        methodCalls: [
          {
            methodName: "select_staking_pool",
            args: {
              staking_pool_account_id: stakingPoolId,
            },
          },
        ],
      });
    },
    [mutateLockupAsync, lockupAccountId]
  );

  return {
    selectStakingPoolAsync,
    error,
  };
};
