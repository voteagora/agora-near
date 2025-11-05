import { useMutation } from "@tanstack/react-query";

interface MarkProofAsClaimedArgs {
  campaignId: number;
  address: string;
  txHash: string;
}

export function useMarkProofAsClaimed() {
  const { mutateAsync: markProofAsClaimed, isPending: isMarking } = useMutation(
    {
      mutationFn: async ({
        campaignId,
        address,
        txHash,
      }: MarkProofAsClaimedArgs) => {
        const response = await fetch(
          `/api/near/claim/proofs/${campaignId}/${address}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ txHash, campaignId }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to mark proof as claimed");
        }

        return response.json();
      },
    }
  );

  return {
    markProofAsClaimed,
    isMarking,
  };
}
