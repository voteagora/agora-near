"use client";

import { useProposals } from "@/hooks/useProposals";
import InfiniteScroll from "react-infinite-scroller";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NearProposalTimeStatus from "./NearProposalTimeStatus";
import Link from "next/link";
import PageHeader from "@/components/Layout/PageHeader/PageHeader";
import { VStack } from "@/components/Layout/Stack";
import NearProposalStatus from "./NearProposalStatus";

const Loader = () => {
  return (
    <div key={0}>
      <div
        className="flex flex-row gl_loader justify-center py-6 text-sm text-secondary"
        key="loader"
      >
        Loading...
      </div>
    </div>
  )
}

export default function NearProposals() {
  const { proposals, isLoading: isLoadingProposals } = useProposals(0, 10);
  console.log(proposals);

  const [hasMore, setHasMore] = useState(false);
  
  const loadMore = () => {

  }

  return (
    <div className="flex flex-col max-w-[76rem]">
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-4 sm:mb-auto">
        <PageHeader headerText="All Proposals" />
      </div>
      <div className="flex flex-col bg-neutral border border-line rounded-lg shadow-newDefault overflow-hidden">
        <div>
          {isLoadingProposals && <Loader />}
          {!isLoadingProposals && proposals.length === 0 ? (
            <div className="flex flex-row justify-center py-8 text-secondary">
              No proposals currently
            </div>
          ) : (
            <InfiniteScroll
              hasMore={hasMore}
              pageStart={0}
              loadMore={loadMore}
              loader={<Loader />}
              element="main"
            >
              {proposals.map((proposal) => (
                <Link
                  key={proposal.id}
                  href={`/proposals/${proposal.id}`}
                >
                  <div className="border-b border-line items-center flex flex-row bg-neutral">
                    <div
                      className={cn(
                        "flex flex-col whitespace-nowrap overflow-ellipsis overflow-hidden py-4 px-6",
                        "w-full sm:w-[55%] items-start justify-center"
                      )}
                    >
                      <div className="flex flex-row text-xs text-secondary gap-1">
                        <div>
                          Proposal by {proposal.proposer_id}
                        </div>
                      </div>
                    </div>
                    <div className="flex-col whitespace-nowrap overflow-ellipsis overflow-hidden py-4 px-6 w-[20%] flex-start justify-center hidden sm:block">
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-secondary">
                          <NearProposalTimeStatus
                            proposalStatus={proposal.status}
                            proposalCreateTime={proposal.creation_time_ns}
                            proposalStartTime={proposal.voting_start_time_ns}
                            proposalDuration={proposal.voting_duration_ns}
                          />
                        </div>
                        <div
                          className={cn(
                            proposal.status.toLowerCase() === 'finished' && "text-positive",
                            "capitalize"
                          )}
                        >
                          {proposal.status.toLowerCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex-col whitespace-nowrap overflow-ellipsis overflow-hidden py-4 px-6 w-[25%] flex-start justify-center hidden sm:block">
                      <div className="overflow-hidden overflow-ellipsis">
                        {proposal.voting_options.length !== 2 && (
                          <VStack className="text-right">
                            <p>{proposal.voting_options.length} Choices</p>
                          </VStack>
                        )}
                        {proposal.voting_options.length === 2 && (
                          <NearProposalStatus proposal={proposal} />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
}
