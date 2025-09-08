import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { DELEGATES_QK } from "./useDelegates";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";
import { useQueryState } from "nuqs";
import Big from "big.js";
import { GetDelegatesResponse } from "@/lib/api/delegates/types";

type Props = {
  onSuccess?: () => void;
  delegateVotingPower: Big;
  currentDelegateeAddress?: string;
};

export function useDelegateAll({
  onSuccess,
  delegateVotingPower,
  currentDelegateeAddress,
}: Props) {
  const queryClient = useQueryClient();
  const targetDelegateeAddressRef = useRef<string>();
  const [orderByParam] = useQueryState("order_by");
  const [filterParam] = useQueryState("filter");
  const [issuesParam] = useQueryState("issues", {
    defaultValue: "",
    clearOnDefault: true,
  });

  const onDelegateSuccess = useCallback(() => {
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

              if (delegate.address === targetDelegateeAddressRef.current) {
                return {
                  ...delegate,
                  votingPower: delegateeVotingPower
                    .plus(delegateVotingPower)
                    .toFixed(),
                };
              }

              if (delegate.address === currentDelegateeAddress) {
                return {
                  ...delegate,
                  votingPower: delegateeVotingPower
                    .minus(delegateVotingPower)
                    .toFixed(),
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
    currentDelegateeAddress,
    delegateVotingPower,
  ]);

  const { mutate, isPending, error } = useWriteHOSContract({
    contractType: "VENEAR",
    onSuccess: onDelegateSuccess,
  });

  const delegateAll = useCallback(
    (receiverId: string) => {
      targetDelegateeAddressRef.current = receiverId;
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
    },
    [mutate]
  );

  return {
    delegateAll,
    isDelegating: isPending,
    error,
  };
}
