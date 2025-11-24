import { useNear } from "@/contexts/NearContext";
import { CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { NEAR_CLAIM_PROOFS_QK } from "./useNearClaimProofs";
import { useMarkProofAsClaimed } from "./useMarkProofAsClaimed";
import { convertUnit } from "@fastnear/utils";

interface ClaimRewardArgs {
  amount: string;
  merkleProof: string[];
  campaignId: number;
  lockupContract: string;
}

interface BatchClaimRewardsArgs {
  claims: ClaimRewardArgs[];
}

export function useClaimNearRewards({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const { signedAccountId, signAndSendTransactions, viewMethod } = useNear();
  const queryClient = useQueryClient();
  const { markProofAsClaimed } = useMarkProofAsClaimed();

  const onClaimSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [NEAR_CLAIM_PROOFS_QK, signedAccountId],
    });

    onSuccess?.();
  }, [queryClient, signedAccountId, onSuccess]);

  const {
    mutateAsync: batchClaimRewards,
    isPending: isClaiming,
    error: claimError,
  } = useMutation({
    mutationFn: async ({ claims }: BatchClaimRewardsArgs) => {
      if (!signedAccountId) {
        throw new Error("No account connected");
      }

      const contractId = CONTRACTS.CLAIM_CONTRACT_ID;
      if (!contractId) {
        throw new Error("Claim contract not configured");
      }

      const claimChecks = await Promise.all(
        claims.map(async (claim) => {
          const hasClaimed = await viewMethod({
            contractId,
            method: "has_claimed",
            args: {
              campaign_id: Number(claim.campaignId),
              account_id: signedAccountId,
            },
          });
          return { claim, hasClaimed };
        })
      );

      const unclaimedItems = claimChecks
        .filter(({ hasClaimed }) => !hasClaimed)
        .map(({ claim }) => claim);

      if (unclaimedItems.length === 0) {
        throw new Error("All rewards have already been claimed");
      }

      if (unclaimedItems.length < claims.length) {
        const alreadyClaimedCount = claims.length - unclaimedItems.length;
        console.warn(
          `${alreadyClaimedCount} reward(s) have already been claimed and will be skipped`
        );
      }

      const transactions = unclaimedItems.map((claim) => ({
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall" as const,
            params: {
              methodName: "claim",
              args: {
                amount: claim.amount,
                merkle_proof: claim.merkleProof,
                campaign_id: Number(claim.campaignId),
                lockup_contract: claim.lockupContract,
              },
              gas: convertUnit("100 Tgas"),
              deposit: "0",
            },
          },
        ],
      }));

      const results = await signAndSendTransactions({ transactions });

      if (results && results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const claim = unclaimedItems[i];

          if (result && result.transaction?.hash) {
            try {
              await markProofAsClaimed({
                campaignId: claim.campaignId,
                address: signedAccountId,
                txHash: result.transaction.hash,
              });
            } catch (error) {
              console.error("Failed to mark proof as claimed:", error);
            }
          }
        }
      }

      return results;
    },
    onSuccess: onClaimSuccess,
  });

  return useMemo(
    () => ({
      batchClaimRewards,
      isClaiming,
      error: claimError,
    }),
    [batchClaimRewards, isClaiming, claimError]
  );
}
