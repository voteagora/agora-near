import { useReadHOSContract } from "./useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/near/constants";
import { ProposalInfo } from "@/lib/contracts/types/voting";

export function useProposals(fromIndex: number = 0, limit: number | null = 10) {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
      methodName: "get_proposals",
      config: {
        args: { from_index: fromIndex, limit },
      },
    },
  ]);

  return {
    proposals: (data || []) as ProposalInfo[],
    isLoading,
    error,
  };
}
