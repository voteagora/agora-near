import { Endpoint } from "@/lib/api/constants";
import { fetchProposalVotes } from "@/lib/api/proposal/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const VOTES_QK = `${Endpoint.Proposals}/votes`;

export const useProposalVotes = ({
  proposalId,
  pageSize,
  blockHeight,
}: {
  proposalId: string;
  pageSize: number;
  blockHeight?: number;
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
    queryKey: [VOTES_QK, proposalId, blockHeight],
    queryFn: ({ pageParam = 1 }) => {
      return fetchProposalVotes(proposalId, pageSize, pageParam, blockHeight);
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
