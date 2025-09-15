import { useWriteHOSContract } from "./useWriteHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useCallback } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { DELEGATES_QK } from "./useDelegates";
import { GetDelegatesResponse } from "@/lib/api/delegates/types";
import { useQueryState } from "nuqs";
import Big from "big.js";

type Props = {
  onSuccess?: () => void;
  delegateVotingPower: Big;
  delegateeAddress: string;
};

export function useUndelegate({
  onSuccess,
  delegateVotingPower,
  delegateeAddress,
}: Props) {
  const queryClient = useQueryClient();
  const [orderByParam] = useQueryState("order_by");
  const [filterParam] = useQueryState("filter");
  const [issuesParam] = useQueryState("issues", {
    defaultValue: "",
    clearOnDefault: true,
  });

  const onUndelegateSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
    });

    queryClient.setQueryData(
      [DELEGATES_QK, orderByParam, filterParam, issuesParam],
      (oldData: InfiniteData<GetDelegatesResponse>) => {
        const updatedPages = oldData?.pages.map((page) => {
          return {
            ...page,
            delegates: page.delegates.map((delegate) => {
              const delegateeVotingPower = Big(delegate.votingPower ?? "0");

              if (delegate.address === delegateeAddress) {
                const newDelegateeVotingPower =
                  delegateeVotingPower.minus(delegateVotingPower);

                return {
                  ...delegate,
                  votingPower: newDelegateeVotingPower.lt(0)
                    ? "0"
                    : newDelegateeVotingPower.toFixed(),
                };
              }

              return delegate;
            }),
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );

    queryClient.invalidateQueries({
      queryKey: [DELEGATES_QK, orderByParam, filterParam, issuesParam],
      refetchType: "none",
    });

    onSuccess?.();
  }, [
    queryClient,
    orderByParam,
    filterParam,
    issuesParam,
    onSuccess,
    delegateeAddress,
    delegateVotingPower,
  ]);

  const { mutate, isPending, error } = useWriteHOSContract({
    contractType: "VENEAR",
    onSuccess: onUndelegateSuccess,
  });

  const undelegate = useCallback(() => {
    return mutate({
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodCalls: [
        {
          methodName: "undelegate",
        },
      ],
    });
  }, [mutate]);

  return {
    undelegate,
    isUndelegating: isPending,
    error,
  };
}
