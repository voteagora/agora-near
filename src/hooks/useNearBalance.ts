import { useNear } from "@/contexts/NearContext";
import { useQuery } from "@tanstack/react-query";

export const QK = "near-balance";

export const useNearBalance = (accountId: string | undefined) => {
  const { getBalance } = useNear();

  const {
    data: nearBalance,
    isLoading: isLoadingNearBalance,
    error: nearBalanceError,
  } = useQuery({
    queryKey: [QK, accountId],
    queryFn: () => (accountId ? getBalance(accountId) : null),
    enabled: !!accountId,
  });

  return {
    nearBalance,
    isLoadingNearBalance,
    nearBalanceError,
  };
};
