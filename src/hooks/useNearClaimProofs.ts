import { useQuery } from "@tanstack/react-query";
import { ClaimProofsResponse } from "@/types/nearClaim";
import axios from "axios";

export const NEAR_CLAIM_PROOFS_QK = "near-claim-proofs";

export const useNearClaimProofs = (accountId: string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery<ClaimProofsResponse>({
    queryKey: [NEAR_CLAIM_PROOFS_QK, accountId],
    queryFn: async () => {
      if (!accountId) throw new Error("Account ID is required");

      const response = await axios.get(`/api/near/claim/proofs/${accountId}`);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch claim proofs: ${response.statusText}`);
      }

      return response.data;
    },
    enabled: !!accountId,
  });

  const hasUnclaimedRewards =
    data && data.proofs.some((proof) => !proof.claimed);
  const totalUnclaimedAmount =
    data?.proofs
      .filter((proof) => !proof.claimed)
      .reduce((sum, proof) => {
        const currentSum = BigInt(sum);
        const proofAmount = BigInt(proof.amount);
        return (currentSum + proofAmount).toString();
      }, "0") || "0";

  return {
    data,
    isLoading,
    error,
    refetch,
    hasUnclaimedRewards,
    totalUnclaimedAmount,
    unclaimedProofs: data?.proofs.filter((proof) => !proof.claimed) || [],
  };
};
