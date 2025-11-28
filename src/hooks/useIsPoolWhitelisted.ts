import { useNear } from "@/contexts/NearContext";
import { useVenearConfig } from "./useVenearConfig";

export const useIsPoolWhitelisted = (whitelistOverride?: string) => {
  const { viewMethod } = useNear();
  const { stakingPoolWhitelistId, isLoading } = useVenearConfig({
    enabled: true,
  });
  const effectiveWhitelistId = whitelistOverride || stakingPoolWhitelistId;

  async function isWhitelisted(poolAccountId?: string) {
    if (!effectiveWhitelistId || !poolAccountId) return false;
    const res = await viewMethod({
      contractId: effectiveWhitelistId,
      method: "is_whitelisted",
      args: { staking_pool_account_id: poolAccountId },
    });
    return Boolean(res);
  }

  return {
    isWhitelisted,
    isLoading,
    whitelistAccountId: effectiveWhitelistId,
  };
};
