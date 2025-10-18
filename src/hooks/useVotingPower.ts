import { CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";

export const useVotingPower = (accountId?: string, blockHeight?: number) => {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "ft_balance_of" as const,
      config: {
        args: { account_id: accountId ?? "" },
        enabled: !!accountId,
      },
      blockId: blockHeight,
      useArchivalNode: !!blockHeight,
    },
  ]);

  return {
    data,
    isLoading,
    error,
  };
};
