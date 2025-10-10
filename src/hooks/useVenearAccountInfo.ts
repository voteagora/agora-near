import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";
import { useMemo } from "react";

export function useVenearAccountInfo(accountId: string | undefined | null) {
  const results = useReadHOSContract([
    {
      contractId: CONTRACTS.VENEAR_CONTRACT_ID,
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
      lockupVersion: accountData?.internal?.lockup_version,
    };
  }, [
    accountId,
    error,
    isLoading,
    accountData?.account,
    accountData?.internal?.lockup_version,
  ]);

  return {
    data,
    isLoading,
    error,
  };
}
