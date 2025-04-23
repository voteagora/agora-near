import { ProposalMetadata } from "@/lib/contracts/types/voting";
import { TESTNET_CONTRACTS } from "@/lib/near/constants";
import { useQueryClient } from "@tanstack/react-query";
import Big from "big.js";
import { useCallback, useMemo } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

type Props = {
  baseFee: string;
  storageFee: string;
};

export const useCreateProposal = ({ baseFee, storageFee }: Props) => {
  const queryClient = useQueryClient();

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VOTING_CONTRACT_ID],
    });
  }, [queryClient]);

  const {
    mutate: mutateCreateProposal,
    isPending: isCreatingProposal,
    error: createProposalError,
  } = useWriteHOSContract({
    contractType: "VOTING",
    onSuccess,
  });

  const totalDeposit = useMemo(() => {
    // TODO: Proper calculation is to take size of JSON stringified metadata * storage cost per byte and add some padding
    return Big(baseFee)
      .plus(storageFee)
      .plus("100000000000000000000000")
      .toFixed();
  }, [baseFee, storageFee]);

  const createProposal = useCallback(
    (metadata: ProposalMetadata) => {
      return mutateCreateProposal({
        contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "create_proposal",
            args: { metadata },
            gas: "100 Tgas",
            deposit: totalDeposit,
          },
        ],
      });
    },
    [mutateCreateProposal, totalDeposit]
  );

  return {
    createProposal,
    isCreatingProposal,
    createProposalError,
  };
};
