import { getProposalQuorum } from "@/lib/api/proposal/requests";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const PROPOSAL_QUORUM_QK = "proposal-quorum";

export const useProposalQuorum = ({
  proposalId,
}: {
  proposalId: string;
}): { quorumAmount: string | undefined; isLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: [PROPOSAL_QUORUM_QK, proposalId],
    queryFn: async () => {
      const { data } = await getProposalQuorum({ proposalId });
      return data;
    },
  });

  return useMemo(
    () => ({ quorumAmount: data?.quorumAmount, isLoading }),
    [data?.quorumAmount, isLoading]
  );
};
