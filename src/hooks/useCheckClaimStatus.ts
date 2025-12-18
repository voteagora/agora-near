import { useNear } from "@/contexts/NearContext";
import { CONTRACTS } from "@/lib/contractConstants";
import { useQuery } from "@tanstack/react-query";

interface UseCheckClaimStatusArgs {
  campaignIds: number[];
  accountId: string | undefined;
}

export const CHECK_CLAIM_STATUS_QK = "check-claim-status";

export function useCheckClaimStatus({
  campaignIds,
  accountId,
}: UseCheckClaimStatusArgs) {
  const { viewMethod } = useNear();

  const { data, isLoading, error } = useQuery({
    queryKey: [CHECK_CLAIM_STATUS_QK, accountId, campaignIds],
    queryFn: async () => {
      if (!accountId) throw new Error("Account ID is required");

      const contractId = CONTRACTS.CLAIM_CONTRACT_ID;
      if (!contractId) {
        throw new Error("Claim contract not configured");
      }

      const claimStatuses = await Promise.all(
        campaignIds.map(async (campaignId) => {
          try {
            const hasClaimed = await viewMethod({
              contractId,
              method: "has_claimed",
              args: {
                campaign_id: Number(campaignId),
                account_id: accountId,
              },
            });
            return { campaignId, hasClaimed: hasClaimed as boolean };
          } catch (error) {
            console.error(
              `Error checking claim status for campaign ${campaignId}:`,
              error
            );
            return { campaignId, hasClaimed: false };
          }
        })
      );

      return claimStatuses;
    },
    enabled: !!accountId && campaignIds.length > 0,
  });

  const claimStatusMap = new Map(
    data?.map((status) => [status.campaignId, status.hasClaimed])
  );

  const allClaimed = data?.every((status) => status.hasClaimed) ?? false;

  return {
    claimStatuses: data || [],
    claimStatusMap,
    allClaimed,
    isLoading,
    error,
  };
}
