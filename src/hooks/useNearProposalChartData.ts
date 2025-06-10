import { Endpoint } from "@/lib/api/constants";
import { fetchProposalChartData } from "@/lib/api/proposal/requests";
import { useQuery } from "@tanstack/react-query";

const CHART_DATA_QK = `${Endpoint.Proposals}/charts`;

export const useProposalChartData = ({
  proposalId,
}: {
  proposalId: string;
}) => {
  const { data, error, isFetching, status } = useQuery({
    queryKey: [CHART_DATA_QK, proposalId],
    queryFn: () => {
      return fetchProposalChartData(proposalId);
    },
  });

  return {
    data,
    error,
    isFetching,
    status,
  };
};
