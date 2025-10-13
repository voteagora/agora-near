import { Endpoint } from "@/lib/api/constants";
import { fetchProposalChartData } from "@/lib/api/proposal/requests";
import { useQuery } from "@tanstack/react-query";

export const CHART_DATA_QK = `${Endpoint.Proposals}/charts`;

export const useProposalChartData = ({
  proposalId,
  blockHeight,
}: {
  proposalId: string;
  blockHeight?: number;
}) => {
  const { data, error, status, isPending } = useQuery({
    queryKey: [CHART_DATA_QK, proposalId, blockHeight],
    queryFn: () => {
      return fetchProposalChartData(proposalId, blockHeight);
    },
  });

  return {
    data,
    error,
    isLoading: isPending,
    status,
  };
};
