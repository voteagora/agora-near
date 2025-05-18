import { useCallback } from "react";
import {
  READ_NEAR_CONTRACT_QK,
  useReadHOSContract,
} from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";
import { useQueryClient } from "@tanstack/react-query";

export const useLockupStakingPool = ({
  lockupAccountId,
}: {
  lockupAccountId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: mutateLockupAsync } = useWriteHOSContract({
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

  const [
    {
      data: stakingPoolId,
      isLoading: isLoadingStakingPoolId,
      error: stakingPoolError,
    },
  ] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_staking_pool_account_id" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
  ]);

  return {
    stakingPoolId,
    isLoadingStakingPoolId,
    stakingPoolError,
    selectStakingPoolAsync,
  };
};
