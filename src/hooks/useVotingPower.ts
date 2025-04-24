import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";

export const useVotingPower = (accountId?: string) => {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "ft_balance_of" as const,
      config: {
        args: { account_id: accountId ?? "" },
        enabled: !!accountId,
      },
    },
  ]);

  return {
    data,
    isLoading,
    error,
  };
};
