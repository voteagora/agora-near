import { useCallback } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";
import { useNear } from "@/contexts/NearContext";
import { useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { NEAR_BALANCE_QK } from "./useNearBalance";

export const useUnlockAndWithdraw = ({
  onSuccess,
  lockupAccountId,
}: {
  onSuccess: () => void;
  lockupAccountId: string;
}) => {
  const { signedAccountId } = useNear();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useWriteHOSContract({
    contractType: "LOCKUP",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
      });

      queryClient.invalidateQueries({
        queryKey: [NEAR_BALANCE_QK, signedAccountId],
      });

      onSuccess();
    },
  });

  const unlockAndWithdraw = useCallback(
    ({ amount }: { amount?: string }) => {
      return mutateAsync({
        contractId: lockupAccountId,
        methodCalls: [
          { methodName: "end_unlock_near" as const, args: { amount } },
          {
            methodName: "transfer" as const,
            args: { amount, receiver_id: signedAccountId },
          },
        ],
      });
    },
    [lockupAccountId, mutateAsync, signedAccountId]
  );

  return {
    unlockAndWithdraw,
    isLoading: isPending,
    error,
  };
};
