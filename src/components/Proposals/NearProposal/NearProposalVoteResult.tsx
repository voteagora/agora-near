"use client";

import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { useState } from "react";
import NearProposalVoteFilter from "./NearProposalVoteFilter";
import NearProposalVoteSummary from "./NearProposalVoteSummary";
import NearProposalVotingActions from "./NearProposalVotingActions";
import InfiniteScroll from "react-infinite-scroller";
import { useProposalVotes } from "@/hooks/useNearProposalVotes";
import { HStack } from "@/components/Layout/Stack";
import { VStack } from "@/components/Layout/Stack";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, X, MinusIcon } from "lucide-react";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import clsx from "clsx";
import { useNear } from "@/contexts/NearContext";
import { useProposalNonVoters } from "@/hooks/useNearProposalNonVoters";

const NearProposalVoteResult = ({
  proposal,
  config,
}: {
  proposal: ProposalInfo;
  config: VotingConfig;
}) => {
  const [showVoters, setShowVoters] = useState(true);
  const { signedAccountId } = useNear();

  const {
    data: votingHistory,
    isFetching: isVotingHistoryFetching,
    hasNextPage,
    fetchNextPage,
  } = useProposalVotes({
    proposalId: proposal.id.toString(),
    pageSize: 20,
  });

  const {
    data: nonVoters,
    isFetching: isNonVotersFetching,
    hasNextPage: hasNextNonVotersPage,
    fetchNextPage: fetchNextNonVotersPage,
  } = useProposalNonVoters({
    proposalId: proposal.id.toString(),
    pageSize: 20,
  });

  return (
    <div
      className={`fixed flex justify-between gap-4 sm:sticky top-[auto] sm:top-20 sm:max-h-[calc(100vh-162px)] sm:w-[24rem] w-[calc(100%-32px)] max-h-[calc(100%-190px)] items-stretch flex-shrink max-w-[24rem] bg-neutral border border-line rounded-xl shadow-newDefault mb-8 transition-all`}
      style={{
        transition: "bottom 600ms cubic-bezier(0, 0.975, 0.015, 0.995)",
      }}
    >
      <div className="flex flex-col gap-4 min-h-0 shrink pt-4 w-full">
        <div className="flex flex-col gap-4">
          <div className="font-semibold px-4 text-primary">Voting activity</div>
          <NearProposalVoteSummary proposal={proposal} />
          <div className="px-4 pb-4">
            <NearProposalVoteFilter
              initialSelection={showVoters ? "Voters" : "Hasn't voted"}
              onSelectionChange={(value) => {
                setShowVoters(value === "Voters");
              }}
            />
          </div>
          <div className="px-4 pb-4 overflow-y-auto max-h-[calc(100vh-437px)]">
            {!showVoters && !isNonVotersFetching && nonVoters && (
              <InfiniteScroll
                hasMore={hasNextNonVotersPage}
                pageStart={0}
                loadMore={() => {
                  if (hasNextNonVotersPage) {
                    fetchNextNonVotersPage();
                  }
                }}
                useWindow={false}
                loader={
                  <div
                    className="flex text-xs font-medium text-secondary"
                    key={0}
                  >
                    Loading more non-voters...
                  </div>
                }
                element="main"
              >
                <ul className="flex flex-col">
                  {nonVoters.map((nonVoter) => (
                    <li key={nonVoter.id}>
                      <VStack
                        gap={2}
                        className="text-xs text-tertiary px-0 py-1"
                      >
                        <VStack>
                          <HoverCard openDelay={100} closeDelay={100}>
                            <HoverCardTrigger>
                              <HStack
                                justifyContent="justify-between"
                                className="font-semibold text-secondary"
                              >
                                <HStack gap={1} alignItems="items-center">
                                  {nonVoter.registeredVoterId}
                                  {nonVoter.registeredVoterId ===
                                    signedAccountId && (
                                    <p className="text-primary">(you)</p>
                                  )}
                                </HStack>
                              </HStack>
                            </HoverCardTrigger>
                          </HoverCard>
                        </VStack>
                      </VStack>
                    </li>
                  ))}
                </ul>
              </InfiniteScroll>
            )}

            {showVoters && !isVotingHistoryFetching && votingHistory && (
              <InfiniteScroll
                hasMore={hasNextPage}
                pageStart={0}
                loadMore={() => {
                  if (hasNextPage) {
                    fetchNextPage();
                  }
                }}
                useWindow={false}
                loader={
                  <div
                    className="flex text-xs font-medium text-secondary"
                    key={0}
                  >
                    Loading more votes...
                  </div>
                }
                element="main"
              >
                <ul className="flex flex-col">
                  {votingHistory.map((vote) => (
                    <li key={vote.accountId}>
                      <VStack
                        gap={2}
                        className="text-xs text-tertiary px-0 py-1"
                      >
                        <VStack>
                          <HoverCard openDelay={100} closeDelay={100}>
                            <HoverCardTrigger>
                              <HStack
                                justifyContent="justify-between"
                                className="font-semibold text-secondary"
                              >
                                <HStack gap={1} alignItems="items-center">
                                  {vote.accountId}
                                  {vote.accountId === signedAccountId && (
                                    <p className="text-primary">(you)</p>
                                  )}
                                </HStack>
                                <HStack alignItems="items-center">
                                  <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={clsx(
                                            "flex items-center gap-1",
                                            Number(vote.voteOption) === 0
                                              ? "text-positive"
                                              : Number(vote.voteOption) === 1
                                                ? "text-negative"
                                                : "text-secondary"
                                          )}
                                        >
                                          <NearTokenAmount
                                            amount={vote.votingPower}
                                            hideCurrency
                                          />
                                          {Number(vote.voteOption) === 0 && (
                                            <CheckIcon
                                              strokeWidth={4}
                                              className="w-3 h-3 text-positive"
                                            />
                                          )}
                                          {Number(vote.voteOption) === 1 && (
                                            <X
                                              strokeWidth={4}
                                              className="w-3 h-3 text-negative"
                                            />
                                          )}
                                          {Number(vote.voteOption) === 2 && (
                                            <MinusIcon
                                              strokeWidth={4}
                                              className="w-3 h-3 text-secondary"
                                            />
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="p-4">
                                        <NearTokenAmount
                                          amount={vote.votingPower}
                                        />
                                        Voted{" "}
                                        {Number(vote.voteOption) === 0
                                          ? "For"
                                          : Number(vote.voteOption) === 1
                                            ? "Against"
                                            : "Abstain"}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </HStack>
                              </HStack>
                            </HoverCardTrigger>
                          </HoverCard>
                        </VStack>
                      </VStack>
                    </li>
                  ))}
                </ul>
              </InfiniteScroll>
            )}

            {isVotingHistoryFetching ||
              (isNonVotersFetching && (
                <div className="text-secondary text-xs">Loading...</div>
              ))}
          </div>
          <NearProposalVotingActions proposal={proposal} config={config} />
        </div>
      </div>
    </div>
  );
};

export default NearProposalVoteResult;
