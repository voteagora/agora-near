import { ProposalMetadata } from "@/lib/contracts/types/voting";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import Big from "big.js";
import { useCallback, useMemo } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

type Props = {
  baseFee: string;
  storageFee: string;
};

type CreateProposalProps = {
  onSuccess?: () => void;
};

export const useCreateProposal = ({
  baseFee,
  storageFee,
  onSuccess,
}: Props & CreateProposalProps) => {
  const queryClient = useQueryClient();

  const onProposalCreateSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VOTING_CONTRACT_ID],
    });
    onSuccess?.();
  }, [queryClient, onSuccess]);

  const {
    mutate: mutateCreateProposal,
    isPending: isCreatingProposal,
    error: createProposalError,
  } = useWriteHOSContract({
    contractType: "VOTING",
    onSuccess: onProposalCreateSuccess,
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
