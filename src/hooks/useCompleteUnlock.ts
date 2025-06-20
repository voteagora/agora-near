import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

export const useCompleteUnlock = ({
  onSuccess,
  lockupAccountId,
}: {
  onSuccess: () => void;
  lockupAccountId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useWriteHOSContract({
    contractType: "LOCKUP",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
      });

      onSuccess();
    },
  });

  const completeUnlock = useCallback(
    ({ amount }: { amount?: string }) => {
      return mutateAsync({
        contractId: lockupAccountId,
        methodCalls: [
          { methodName: "end_unlock_near" as const, args: { amount } },
        ],
      });
    },
    [lockupAccountId, mutateAsync]
  );

  return {
    completeUnlock,
    isLoading: isPending,
    error,
  };
};
