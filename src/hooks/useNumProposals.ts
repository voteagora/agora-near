import { CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";
import { useMemo } from "react";

export const useNumProposals = () => {
  const [{ data: numProposals, isLoading, error }] = useReadHOSContract([
    {
      contractId: CONTRACTS.VOTING_CONTRACT_ID,
      methodName: "get_num_proposals",
      config: {
        args: {},
        // This ensures we fetch the number of proposals only once pers page load
        staleTime: Infinity,
        gcTime: 0,
      },
    },
  ]);

  return useMemo(
    () => ({ numProposals, isLoading, error }),
    [numProposals, isLoading, error]
  );
};
