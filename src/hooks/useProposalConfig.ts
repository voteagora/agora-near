import { useReadHOSContract } from "./useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/near/constants";
import { VotingConfig } from "@/lib/contracts/near/votingTypes";

export function useProposalConfig() {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
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
