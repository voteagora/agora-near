import { Endpoint } from "@/lib/api/constants";
import { fetchDelegates } from "@/lib/api/delegates/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQueryState } from "nuqs";

const DELEGATES_QK = `${Endpoint.Delegates}`;

export const useDelegates = ({
  pageSize,
  orderBy,
  filter,
}: {
  pageSize: number;
  orderBy: string | null;
  filter: string | null;
}) => {
  const [issuesParam] = useQueryState("issues", {
    defaultValue: "",
    clearOnDefault: true,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`${DELEGATES_QK}-${orderBy}-${filter}-${issuesParam}`],
    queryFn: ({ pageParam = 1 }) => {
      return fetchDelegates(
        pageSize,
        pageParam,
        orderBy,
        filter,
        issuesParam || null
      );
    },
    getNextPageParam: (currentPage, _, pageParam) => {
      if (currentPage.count <= pageParam * pageSize) return undefined;

      return pageParam + 1;
    },
    initialPageParam: 1,
  });

  const flatData = useMemo(() => {
    const records = data?.pages.map((page) => page.delegates).flat();

    // If sorting by random, there is a known API issue where the same delegate
    // can get returned across multiple pages. This is a hacky workaround until we
    // can implement a better random sorting solution that works for pagination.
    // See https://voteagora.atlassian.net/browse/AXB-238
    const uniqueDelegatesMap = new Map();
    records?.forEach((delegate) => {
      uniqueDelegatesMap.set(delegate.address, delegate);
    });

    return Array.from(uniqueDelegatesMap.values());
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
