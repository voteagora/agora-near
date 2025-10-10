import { useNear } from "@/contexts/NearContext";
import { CONTRACTS } from "@/lib/contractConstants";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useNumProposals } from "./useNumProposals";

const PROPOSAL_QUERY_KEY = "proposals";

const DEFAULT_PAGE_SIZE = 10;

type UseProposalsProps = {
  pageSize?: number;
};

export function useProposals({
  pageSize = DEFAULT_PAGE_SIZE,
}: UseProposalsProps) {
  const { viewMethod } = useNear();

  const { numProposals } = useNumProposals();

  const fetchProposals = useCallback(
    async ({ pageParam = 0 }) => {
      const result = (await viewMethod({
        contractId: CONTRACTS.VOTING_CONTRACT_ID,
        method: "get_proposals",
        args: { from_index: pageParam, limit: pageSize },
      })) as ProposalInfo[];
      return result;
    },
    [viewMethod]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [PROPOSAL_QUERY_KEY],
    queryFn: fetchProposals,
    getNextPageParam: (currentPage, pages) => {
      // If we have numProposals, use that as source of truth
      if (numProposals && pages.length * pageSize >= numProposals) {
        return undefined;
      }

      // We may not have fetched numProposals yet, in which case fallback to using the currently fetched
      // page to determine if we've reached the end
      if (!currentPage || currentPage.length === 0) {
        return undefined;
      }

      return pages.length * pageSize;
    },
    initialPageParam: 0,
  });

  return useMemo(
    () => ({
      proposals: data?.pages.flat(),
      error,
      isFetching,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      status,
    }),
    [
      data?.pages,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    ]
  );
}
