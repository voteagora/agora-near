import { useQuery } from "@tanstack/react-query";
import {
  fetchFungibleTokens,
  FungibleTokensResponse,
} from "@/lib/api/fungibleTokens";

export const FUNGIBLE_TOKEN_QK = "fungible-tokens";

export function useFungibleTokens(accountId: string | undefined) {
  return useQuery<FungibleTokensResponse | null>({
    queryKey: [FUNGIBLE_TOKEN_QK, accountId],
    queryFn: () => (accountId ? fetchFungibleTokens(accountId) : null),
    enabled: !!accountId,
  });
}
