import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";

export const useProposal = (proposalId: string) => {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
      methodName: "get_proposal",
      config: { args: { proposal_id: Number(proposalId) } },
    },
  ]);

  return {
    proposal: data,
    isLoading,
    error,
  };
};
