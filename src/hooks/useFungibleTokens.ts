import { useQuery } from "@tanstack/react-query";
import {
  fetchFungibleTokens,
  FungibleTokensResponse,
} from "@/lib/api/fungibleTokens";

export const QK = "fungible-tokens";

export function useFungibleTokens(accountId: string | undefined) {
  return useQuery<FungibleTokensResponse | null>({
    queryKey: [QK, accountId],
    queryFn: () =>
      accountId ? fetchFungibleTokens(accountId, "testnet") : null,
    enabled: !!accountId,
  });
}
