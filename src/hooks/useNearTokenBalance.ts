import { useNear } from "@/contexts/NearContext";
import { useQuery } from "@tanstack/react-query";

export const TOKEN_BALANCE_QK = "tokenBalance";

export const useNearTokenBalance = (address?: string) => {
  const { getBalance } = useNear();
  const { data, isFetching, isFetched } = useQuery({
    enabled: !!address,
    queryKey: [TOKEN_BALANCE_QK, address],
    queryFn: () => {
      return getBalance(address ?? "");
    },
    staleTime: 180000, // 3 minute cache
  });
  return { data, isFetching, isFetched };
};
