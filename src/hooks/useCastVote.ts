import { useNear } from "@/contexts/NearContext";
import { MerkleProof } from "@/lib/contracts/types/common";
import { VAccount } from "@/lib/contracts/types/venear";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

interface CastVoteArgs {
  proposalId: number;
  voteIndex: number;
  voteStorageFee: string;
  blockId: number;
}

export function useCastVote() {
  const { signedAccountId } = useNear();
  const queryClient = useQueryClient();
  const { viewMethod } = useNear();

  const onVoteSuccess = useCallback(() => {
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VOTING_CONTRACT_ID],
      }),
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
      }),
    ]);
  }, [queryClient]);

  const {
    mutateAsync: mutateVote,
    isPending: isVoting,
    error: votingError,
  } = useWriteHOSContract({
    contractType: "VOTING",
    onSuccess: onVoteSuccess,
  });

  const castVote = useCallback(
    async ({
      proposalId,
      voteIndex,
      voteStorageFee,
      blockId,
    }: CastVoteArgs) => {
      const proof = (await viewMethod({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        method: "get_proof",
        args: { account_id: signedAccountId },
        blockId,
        useArchivalNode: true,
      })) as [MerkleProof, VAccount] | null;

      if (!proof) {
        throw new Error("Account merkle proof not found");
      }

      const [merkleProof, vAccount] = proof;

      return mutateVote({
        contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "vote",
            args: {
              proposal_id: proposalId,
              vote: voteIndex,
              merkle_proof: merkleProof,
              v_account: vAccount,
            },
            deposit: voteStorageFee,
          },
        ],
      });
    },
    [viewMethod, signedAccountId, mutateVote]
  );

  return useMemo(
    () => ({
      castVote,
      isVoting,
      error: votingError,
    }),
    [castVote, isVoting, votingError]
  );
}
