import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useMemo } from "react";

export function useVenearAccountInfo(accountId: string | undefined | null) {
  const results = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_account_info" as const,
      config: {
        args: { account_id: accountId || "" },
        enabled: !!accountId,
      },
    },
  ]);

  const [{ data: accountData, isLoading, error }] = results;

  const data = useMemo(() => {
    if (!accountId || error || isLoading) return null;

    const account = accountData?.account;

    if (!account) return null;

    return {
      accountId,
      totalBalance: {
        near: account.balance?.near_balance || "0",
        extraBalance: account.balance?.extra_venear_balance || "0",
      },
      delegatedBalance: {
        near: account.delegated_balance?.near_balance || "0",
        extraBalance: account.delegated_balance?.extra_venear_balance || "0",
      },
      delegation: account.delegation
        ? {
            delegatee: account.delegation.account_id,
          }
        : undefined,
    };
  }, [accountId, error, isLoading, accountData?.account]);

  return {
    data,
    isLoading,
    error,
  };
}
