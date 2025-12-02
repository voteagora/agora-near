import { ProposalMetadata } from "@/lib/contracts/types/voting";
import { CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import { MixpanelEvents } from "@/lib/analytics/mixpanel";
import { trackEvent } from "@/lib/analytics";
import Big from "big.js";
import { useCallback } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

const NEAR_STORAGE_BYTE_COST = "10000000000000000000";

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
      queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VOTING_CONTRACT_ID],
    });
    trackEvent({ event_name: MixpanelEvents.ProposalCreated });
    onSuccess?.();
  }, [queryClient, onSuccess]);

  const {
    mutate: mutateCreateProposal,
    mutateAsync: mutateCreateProposalAsync,
    isPending: isCreatingProposal,
    error: createProposalError,
  } = useWriteHOSContract({
    contractType: "VOTING",
    onSuccess: onProposalCreateSuccess,
  });

  const calculateDeposit = useCallback(
    (metadata: ProposalMetadata) => {
      const metadataJson = JSON.stringify(metadata);
      const metadataBytes = new TextEncoder().encode(metadataJson).length;
      const storageAddedCost = Big(NEAR_STORAGE_BYTE_COST).mul(metadataBytes);
      return Big(baseFee)
        .plus(storageFee)
        .plus("50000000000000000000000")
        .plus(storageAddedCost)
        .toFixed();
    },
    [baseFee, storageFee]
  );

  const createProposal = useCallback(
    (metadata: ProposalMetadata) => {
      const deposit = calculateDeposit(metadata);
      return mutateCreateProposal({
        contractId: CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "create_proposal",
            args: { metadata },
            gas: "100 Tgas",
            deposit,
          },
        ],
      });
    },
    [mutateCreateProposal, calculateDeposit]
  );

  const createProposalAsync = useCallback(
    (metadata: ProposalMetadata) => {
      const deposit = calculateDeposit(metadata);
      return mutateCreateProposalAsync({
        contractId: CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "create_proposal",
            args: { metadata },
            gas: "100 Tgas",
            deposit,
          },
        ],
      });
    },
    [mutateCreateProposalAsync, calculateDeposit]
  );

  return {
    createProposal,
    createProposalAsync,
    isCreatingProposal,
    createProposalError,
  };
};
