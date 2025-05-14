import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

export const useProposalActions = () => {
  const queryClient = useQueryClient();

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VOTING_CONTRACT_ID],
    });
  }, [queryClient]);

  const {
    mutate: mutateApproveProposal,
    isPending: isApprovingProposal,
    error: approveProposalError,
  } = useWriteHOSContract({
    contractType: "VOTING",
    onSuccess,
  });

  const {
    mutate: mutateRejectProposal,
    isPending: isRejectingProposal,
    error: rejectProposalError,
  } = useWriteHOSContract({
    contractType: "VOTING",
    onSuccess,
  });

  const approveProposal = useCallback(
    (proposalId: number, votingStartTimeSec?: number) => {
      return mutateApproveProposal({
        contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "approve_proposal",
            args: {
              proposal_id: proposalId,
              voting_start_time_sec: votingStartTimeSec || null,
            },
            deposit: "1",
            gas: "300 TGas",
          },
        ],
      });
    },
    [mutateApproveProposal]
  );

  const rejectProposal = useCallback(
    (proposalId: number) => {
      return mutateRejectProposal({
        contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "reject_proposal",
            args: {
              proposal_id: proposalId,
            },
            deposit: "1",
            gas: "300 TGas",
          },
        ],
      });
    },
    [mutateRejectProposal]
  );

  return {
    approveProposal,
    isApprovingProposal,
    approveProposalError,
    rejectProposal,
    isRejectingProposal,
    rejectProposalError,
  };
};
