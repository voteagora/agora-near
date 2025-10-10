import { useNear } from "@/contexts/NearContext";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { NEAR_CLAIM_PROOFS_QK } from "./useNearClaimProofs";
import { useMarkProofAsClaimed } from "./useMarkProofAsClaimed";

interface ClaimRewardArgs {
  amount: string; // Balance in yocto NEAR
  merkleProof: string[]; // Array of hash strings
  projectId: string; // Project ID for marking as claimed
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
    mutationFn: async ({ amount, merkleProof, projectId }: ClaimRewardArgs) => {
      if (!signedAccountId) {
        throw new Error("No account connected");
      }

      const contractId = TESTNET_CONTRACTS.CLAIM_CONTRACT_ID;
      if (!contractId) {
        throw new Error("Claim contract not configured");
      }

      // Convert string array to CryptoHash format expected by contract
      const formattedProof = merkleProof.map((hash) => {
        // Remove '0x' prefix if present and ensure it's the right format
        const cleanHash = hash.startsWith("0x") ? hash.slice(2) : hash;
        // Convert hex string to bytes array (assuming 32-byte hashes)
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
        },
        deposit: "1",
      });

      // Mark proof as claimed after successful transaction
      if (result && result.transaction?.hash) {
        try {
          await markProofAsClaimed({
            projectId,
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
