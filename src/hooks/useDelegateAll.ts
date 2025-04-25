import { useWriteHOSContract } from "./useWriteHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";

export function useDelegateAll() {
  const queryClient = useQueryClient();

  const onDelegateSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
    });
  }, [queryClient]);

  const { mutate, isPending, error } = useWriteHOSContract({
    contractType: "VENEAR",
    onSuccess: onDelegateSuccess,
  });

  const delegateAll = (receiverId: string) => {
    return mutate({
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodCalls: [
        {
          methodName: "delegate_all",
          args: {
            receiver_id: receiverId,
          },
        },
      ],
    });
  };

  return {
    delegateAll,
    isDelegating: isPending,
    error,
  };
}
