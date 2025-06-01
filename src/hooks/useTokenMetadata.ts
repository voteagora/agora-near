import { useNear } from "@/contexts/NearContext";
import { CACHE_TTL } from "@/lib/constants";
import { TokenMetadata } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useTokenMetadata = ({ contractId }: { contractId: string }) => {
  const { viewMethod } = useNear();

  const { data, isLoading, error } = useQuery({
    queryKey: ["token-metadata", contractId],
    queryFn: () =>
      viewMethod({
        contractId,
        method: "ft_metadata",
      }) as Promise<TokenMetadata> | null | undefined,
    staleTime: CACHE_TTL.LONG,
  });

  return {
    metadata: data,
    isLoadingMetadata: isLoading,
    errorMetadata: error,
  };
};
