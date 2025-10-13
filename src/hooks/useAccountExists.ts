import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNear } from "@/contexts/NearContext";

export const NEAR_ACCOUNT_EXISTS_QK = "near-account-exists";

/**
 * Checks whether a NEAR account exists by querying its on-chain state.
 */
export function useAccountExists(accountId?: string | null) {
  const { getBalance } = useNear();

  const {
    data: exists,
    isLoading,
    error,
  } = useQuery({
    queryKey: [NEAR_ACCOUNT_EXISTS_QK, accountId],
    enabled: Boolean(accountId),
    queryFn: async () => {
      try {
        const balance = await getBalance(accountId as string);
        // If query succeeds, account exists even if balance is "0"
        return typeof balance === "string";
      } catch {
        // view_account throws if account does not exist
        return false;
      }
    },
    staleTime: 30_000,
  });

  return useMemo(
    () => ({ exists: Boolean(exists), isLoading, error }),
    [exists, isLoading, error]
  );
}
