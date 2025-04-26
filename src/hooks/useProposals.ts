import { useNear } from "@/contexts/NearContext";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

const PROPOSAL_QUERY_KEY = "proposals";

const PAGE_SIZE = 10;

export function useProposals() {
  const { viewMethod } = useNear();

  const fetchProposals = useCallback(
    async ({ pageParam = 0 }) => {
      const result = (await viewMethod({
        contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
        method: "get_proposals",
        args: { from_index: pageParam, limit: PAGE_SIZE },
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
      if (!currentPage || currentPage.length === 0) {
        return undefined;
      }
      return pages.length * PAGE_SIZE;
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
