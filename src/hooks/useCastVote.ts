import { useNear } from "@/contexts/NearContext";
import { CONTRACTS } from "@/lib/contractConstants";
import { MerkleProof } from "@/lib/contracts/types/common";
import { VAccount } from "@/lib/contracts/types/venear";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useFetchProof } from "./useFetchProof";
import { MixpanelEvents } from "@/lib/analytics/mixpanel";
import { trackEvent } from "@/lib/analytics";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { useWriteHOSContract } from "./useWriteHOSContract";

interface CastVoteArgs {
  proposalId: number;
  voteIndex: number;
  voteStorageFee: string;
  blockId: number;
  proof?: [MerkleProof, VAccount];
}

export function useCastVote({ onSuccess }: { onSuccess?: () => void }) {
  const { signedAccountId } = useNear();
  const queryClient = useQueryClient();
  const fetchProof = useFetchProof();

  const onVoteSuccess = useCallback(() => {
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VOTING_CONTRACT_ID],
      }),
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VENEAR_CONTRACT_ID],
      }),
    ]);
    trackEvent({ event_name: MixpanelEvents.VotedOnProposal });
    onSuccess?.();
  }, [queryClient, onSuccess]);

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
      proof,
    }: CastVoteArgs) => {
      if (!signedAccountId) {
        throw new Error("No account connected");
      }

      let merkleProof: MerkleProof;
      let vAccount: VAccount;

      if (proof) {
        [merkleProof, vAccount] = proof;
      } else {
        const proof = await fetchProof(signedAccountId, blockId);

        if (!proof) {
          throw new Error("Account merkle proof not found");
        }

        [merkleProof, vAccount] = proof;
      }

      return mutateVote({
        contractId: CONTRACTS.VOTING_CONTRACT_ID,
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
    [signedAccountId, fetchProof, mutateVote]
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
