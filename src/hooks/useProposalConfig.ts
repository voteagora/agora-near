import { useReadHOSContract } from "./useReadHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";
import { VotingConfig } from "@/lib/contracts/types/voting";
import { getVotingDays } from "@/lib/proposalUtils";

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

  const votingDuration = getVotingDays({
    voting_duration_ns: data?.voting_duration_ns ?? "",
  });

  return {
    config: data as VotingConfig | null,
    votingDuration,
    isLoading,
    error,
  };
}
