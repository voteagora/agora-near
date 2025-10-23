import { useNear } from "@/contexts/NearContext";
import { useVenearConfig } from "./useVenearConfig";

export const useIsPoolWhitelisted = () => {
  const { viewMethod } = useNear();
  const { stakingPoolWhitelistId, isLoading } = useVenearConfig({
    enabled: true,
  });

  async function isWhitelisted(poolAccountId?: string) {
    if (!stakingPoolWhitelistId || !poolAccountId) return false;
    const res = await viewMethod({
      contractId: stakingPoolWhitelistId,
      method: "is_whitelisted",
      args: { staking_pool_account_id: poolAccountId },
    });
    return Boolean(res);
  }

  return {
    isWhitelisted,
    isLoading,
    whitelistAccountId: stakingPoolWhitelistId,
  };
};
