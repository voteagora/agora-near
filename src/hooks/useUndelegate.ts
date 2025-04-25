import { useWriteHOSContract } from "./useWriteHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";

export function useUndelegate() {
  const queryClient = useQueryClient();

  const onUndelegateSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
    });
  }, [queryClient]);

  const { mutate, isPending, error } = useWriteHOSContract({
    contractType: "VENEAR",
    onSuccess: onUndelegateSuccess,
  });

  const undelegate = () => {
    return mutate({
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodCalls: [
        {
          methodName: "undelegate",
        },
      ],
    });
  };

  return {
    undelegate,
    isUndelegating: isPending,
    error,
  };
}
