import { useQuery } from "@tanstack/react-query";
import {
  fetchFungibleTokens,
  FungibleTokensResponse,
} from "@/lib/api/fungibleTokens";
import { useNear } from "@/contexts/NearContext";

export const QK = "fungible-tokens";

export function useFungibleTokens(accountId: string | undefined) {
  const { networkId } = useNear();

  return useQuery<FungibleTokensResponse | null>({
    queryKey: [QK, accountId],
    queryFn: () =>
      accountId ? fetchFungibleTokens(accountId, networkId) : null,
    enabled: !!accountId,
  });
}
