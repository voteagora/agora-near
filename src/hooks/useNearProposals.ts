import { Endpoint } from "@/lib/api/constants";
import { fetchApprovedProposals } from "@/lib/api/proposal/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const APPROVED_PROPOSALS_QK = `${Endpoint.Proposals}/approved`;

export const useNearProposals = ({
  pageSize,
  enabled = true,
}: {
  pageSize: number;
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
    isLoading,
  } = useInfiniteQuery({
    enabled,
    queryKey: [APPROVED_PROPOSALS_QK],
    queryFn: ({ pageParam = 1 }) => {
      return fetchApprovedProposals(pageSize, pageParam);
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
    proposals: flatData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  };
};
