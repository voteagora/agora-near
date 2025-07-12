import { Endpoint } from "@/lib/api/constants";
import { fetchProposalChartData } from "@/lib/api/proposal/requests";
import { useQuery } from "@tanstack/react-query";

export const CHART_DATA_QK = `${Endpoint.Proposals}/charts`;

export const useProposalChartData = ({
  proposalId,
}: {
  proposalId: string;
}) => {
  const { data, error, status, isPending } = useQuery({
    queryKey: [CHART_DATA_QK, proposalId],
    queryFn: () => {
      return fetchProposalChartData(proposalId);
    },
  });

  return {
    data,
    error,
    isLoading: isPending,
    status,
  };
};
