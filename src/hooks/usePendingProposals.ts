import { Endpoint } from "@/lib/api/constants";
import { fetchPendingProposals } from "@/lib/api/proposal/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const PENDING_PROPOSALS_QK = `${Endpoint.Proposals}/pending`;

export const usePendingProposals = ({
  pageSize,
  createdBy,
  enabled = true,
}: {
  pageSize: number;
  createdBy?: string;
  enabled?: boolean;
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
    enabled,
    refetchInterval: 1000 * 60 * 2, // 2 minutes
    queryKey: [PENDING_PROPOSALS_QK, createdBy],
    queryFn: ({ pageParam = 1 }) => {
      return fetchPendingProposals(pageSize, pageParam, createdBy);
    },
    getNextPageParam: (currentPage, _, pageParam) => {
      if (currentPage.count <= pageParam * pageSize) return undefined;

      return pageParam + 1;
    },
    initialPageParam: 1,
  });

  const flatData = useMemo(() => {
    const records = data?.pages.map((page) => page.proposals).flat();
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
