import { useReadHOSContract } from "./useReadHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";
import { VotingConfig } from "@/lib/contracts/types/voting";

export function useProposalConfig() {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: CONTRACTS.VOTING_CONTRACT_ID,
      methodName: "get_config",
      config: {
        args: {},
      },
    },
  ]);

  return {
    config: data as VotingConfig | null,
    isLoading,
    error,
  };
}
