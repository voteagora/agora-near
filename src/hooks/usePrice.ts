import { useQuery } from "@tanstack/react-query";
import { fetchNearPrice } from "@/lib/api/near/requests";
import { CACHE_TTL } from "@/lib/constants";
import { NearPriceResponse } from "@/lib/api/near/types";

const QK = "near-price";

export const usePrice = () => {
  const data = useQuery<NearPriceResponse>({
    queryKey: [QK],
    queryFn: fetchNearPrice,
    staleTime: CACHE_TTL.SHORT,
  });

  return {
    price: data.data?.price,
    isLoading: data.isLoading,
    error: data.error,
  };
};
