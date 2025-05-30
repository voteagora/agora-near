"use client";

import { PaginationParams } from "@/app/lib/pagination";
import DelegateVotes from "./DelegateVotes";
import SnapshotVotes from "./SnapshotVotes";
import VotesContainer from "./VotesContainer";
import { useNearVoteHistory } from "@/hooks/useNearVoteHistory";
import { useCallback } from "react";

interface Props {
  address: string;
}

const VotesContainerWrapper = ({ address }: Props) => {
  // TODO: Fetch from API
  const snapshotVotes = [] as const;

  const {
    data: voteHistory,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  } = useNearVoteHistory({
    pageSize: 10,
    address,
  });

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isLoading || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

  return (
    <VotesContainer
      onchainVotes={
        <>
          {voteHistory && voteHistory.length > 0 ? (
            <div className="flex flex-col gap-4">
              <DelegateVotes
                votingHistory={voteHistory}
                hasMore={hasNextPage}
                onLoadMore={onLoadMore}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-secondary align-middle bg-wash rounded-xl">
              No past votes available.
            </div>
          )}
        </>
      }
      snapshotVotes={
        <>
          {snapshotVotes && snapshotVotes.length > 0 ? (
            <SnapshotVotes
              initialVotes={{
                meta: {
                  has_next: false,
                  total_returned: 0,
                  next_offset: 0,
                },
                data: [],
              }}
              fetchSnapshotVotes={async (pagination: PaginationParams) => {
                return {
                  meta: {
                    has_next: false,
                    total_returned: 0,
                    next_offset: 0,
                  },
                  data: [],
                };
              }}
            />
          ) : (
            <div className="p-8 text-center text-secondary align-middle bg-wash rounded-xl">
              No past votes available.
            </div>
          )}
        </>
      }
    />
  );
};

export const VotesContainerSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse p-12 rounded-lg bg-tertiary/10">
      <div className="h-4 w-1/2 bg-tertiary/20 rounded-md"></div>
      <div className="h-4 w-1/3 bg-tertiary/20 rounded-md"></div>
    </div>
  );
};

export default VotesContainerWrapper;
