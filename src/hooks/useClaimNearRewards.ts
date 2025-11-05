import { useNear } from "@/contexts/NearContext";
import { CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { NEAR_CLAIM_PROOFS_QK } from "./useNearClaimProofs";
import { useMarkProofAsClaimed } from "./useMarkProofAsClaimed";

interface ClaimRewardArgs {
  amount: string;
  merkleProof: string[];
  campaignId: number;
  lockupContract: string;
}

export function useClaimNearRewards({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const { signedAccountId, callMethod } = useNear();
  const queryClient = useQueryClient();
  const { markProofAsClaimed } = useMarkProofAsClaimed();

  const onClaimSuccess = useCallback(() => {
    // Invalidate the claim proofs query to refetch updated data
    queryClient.invalidateQueries({
      queryKey: [NEAR_CLAIM_PROOFS_QK, signedAccountId],
    });

    onSuccess?.();
  }, [queryClient, signedAccountId, onSuccess]);

  const {
    mutateAsync: claimReward,
    isPending: isClaiming,
    error: claimError,
  } = useMutation({
    mutationFn: async ({
      amount,
      merkleProof,
      campaignId,
      lockupContract,
    }: ClaimRewardArgs) => {
      if (!signedAccountId) {
        throw new Error("No account connected");
      }

      const contractId = CONTRACTS.CLAIM_CONTRACT_ID;
      if (!contractId) {
        throw new Error("Claim contract not configured");
      }

      const formattedProof = merkleProof.map((hash) => {
        const cleanHash = hash.startsWith("0x") ? hash.slice(2) : hash;
        const bytes = new Uint8Array(
          cleanHash.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
        );
        return Array.from(bytes);
      });

      const result = await callMethod({
        contractId,
        method: "claim",
        args: {
          amount,
          merkle_proof: formattedProof,
          campaign_id: campaignId,
          lockup_contract: lockupContract,
        },
        deposit: "1",
      });

      if (result && result.transaction?.hash) {
        try {
          await markProofAsClaimed({
            campaignId,
            address: signedAccountId,
            txHash: result.transaction.hash,
          });
        } catch (error) {
          console.error("Failed to mark proof as claimed:", error);
          // Don't throw here - the claim was successful, just the marking failed
        }
      }

      return result;
    },
    onSuccess: onClaimSuccess,
  });

  return useMemo(
    () => ({
      claimReward,
      isClaiming,
      error: claimError,
    }),
    [claimReward, isClaiming, claimError]
  );
}
