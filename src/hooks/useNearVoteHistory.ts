import { Endpoint } from "@/lib/api/constants";
import { fetchVoteHistory } from "@/lib/api/delegates/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const VOTE_HISTORY_QK = `${Endpoint.Delegates}/vote-history`;

export const useNearVoteHistory = ({
  pageSize,
  address,
}: {
  pageSize: number;
  address: string;
}) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [VOTE_HISTORY_QK],
    queryFn: ({ pageParam = 1 }) => {
      return fetchVoteHistory(pageSize, pageParam, address);
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
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
