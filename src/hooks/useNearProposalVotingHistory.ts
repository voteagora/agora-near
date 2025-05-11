import { Endpoint } from "@/lib/api/constants";
import { fetchProposalVotingHistory } from "@/lib/api/proposal/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useProposalVotes = ({
  proposalId,
  pageSize,
}: {
  proposalId: string;
  pageSize: number;
}) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [Endpoint.GetProposalVotingHistory, proposalId, pageSize],
    queryFn: ({ pageParam = 1 }) => {
      return fetchProposalVotingHistory(proposalId, pageSize, pageParam);
    },
    getNextPageParam: (currentPage, _, pageParam) => {
      if (currentPage.count <= pageParam * pageSize) return undefined;

      return pageParam + 1;
    },
    initialPageParam: 1,
  });

  const flatData = useMemo(() => {
    const records = data?.pages.map((page) => page.votes).flat();
    return records?.flat();
  }, [data]);

  return {
    data: flatData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
