"use client";

import { HStack, VStack } from "../../Layout/Stack";
import { formatDistanceToNow } from "date-fns";
import InfiniteScroll from "react-infinite-scroller";
import VoteDetailsContainer from "./DelegateVotesDetailsContainer";
import DelegateVoteIcon from "./DelegateVoteIcon";
import { VoteHistory } from "@/lib/api/delegates/types";
import NearTokenAmount from "@/components/shared/NearTokenAmount";

export default function DelegateVotes({
  votingHistory,
  hasMore,
  onLoadMore,
}: {
  votingHistory: VoteHistory[];
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <InfiniteScroll
      hasMore={hasMore}
      pageStart={0}
      loadMore={onLoadMore}
      useWindow={false}
      loader={
        <div key={0}>
          <HStack
            key="loader"
            className="gl_loader justify-center py-6 text-sm text-secondary"
          >
            Loading...
          </HStack>
        </div>
      }
      element="main"
      className="divide-y divide-line overflow-hidden bg-neutral shadow-newDefault ring-1 ring-line rounded-xl"
    >
      {votingHistory.map(
        (vote) =>
          vote && (
            <VoteDetailsContainer
              key={vote.proposalId}
              proposalId={vote.proposalId}
            >
              <div>
                <VStack className="py-4 px-6">
                  <HStack justifyContent="justify-between" gap={2}>
                    <VStack>
                      <span className="text-tertiary text-xs font-medium">
                        Voted for this proposal{" "}
                        {formatDistanceToNow(new Date(vote.votedAt ?? 0))} ago
                        with <NearTokenAmount amount={vote.votingPower} />
                      </span>
                      <h2 className="px-0 pt-1 overflow-hidden text-base text-primary text-ellipsis">
                        {vote.proposalName ?? `Proposal #${vote.proposalId}`}
                      </h2>
                    </VStack>
                    <DelegateVoteIcon
                      proposalType="STANDARD"
                      support={vote.voteOption === "0" ? "FOR" : "AGAINST"}
                    />
                  </HStack>
                  <VStack className="space-y-1 mt-2">
                    <div className="text-xs text-tertiary font-medium">
                      Voted {vote.voteOption === "0" ? "For" : "Against"}
                    </div>
                  </VStack>
                </VStack>
              </div>
            </VoteDetailsContainer>
          )
      )}
    </InfiniteScroll>
  );
}
