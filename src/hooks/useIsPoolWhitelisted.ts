import { useNear } from "@/contexts/NearContext";
import { useVenearConfig } from "./useVenearConfig";
import { useQuery } from "@tanstack/react-query";

export const useIsPoolWhitelisted = (poolAccountId?: string) => {
  const { viewMethod } = useNear();
  const { stakingPoolWhitelistId } = useVenearConfig({ enabled: true });

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "whitelist:isWhitelisted",
      stakingPoolWhitelistId,
      poolAccountId,
    ],
    queryFn: async () => {
      if (!stakingPoolWhitelistId || !poolAccountId) return null;
      try {
        const res = await viewMethod({
          contractId: stakingPoolWhitelistId,
          method: "is_whitelisted",
          args: { staking_pool_account_id: poolAccountId },
        });
        return Boolean(res);
      } catch (e) {
        return false;
      }
    },
    enabled: !!stakingPoolWhitelistId && !!poolAccountId,
    staleTime: 60_000,
  });

  return {
    isWhitelisted: Boolean(data),
    isLoading,
    error,
    whitelistAccountId: stakingPoolWhitelistId,
  };
};


