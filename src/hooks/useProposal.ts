import { CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";
import { unpackProposal } from "@/lib/proposalUtils";
import { useMemo } from "react";

export const useProposal = (proposalId: string) => {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: CONTRACTS.VOTING_CONTRACT_ID,
      methodName: "get_proposal",
      config: { args: { proposal_id: Number(proposalId) } },
    },
  ]);

  const proposal = useMemo(() => {
    return data ? unpackProposal(data) : null;
  }, [data]);

  return {
    proposal,
    isLoading,
    error,
  };
};
