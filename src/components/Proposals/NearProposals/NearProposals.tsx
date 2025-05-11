"use client";

import { UpdatedButton } from "@/components/Button";
import PageHeader from "@/components/Layout/PageHeader/PageHeader";
import { useProposals } from "@/hooks/useProposals";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { NearProposal } from "./NearProposal";

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
  );
};

function NearProposalsList() {
  const {
    proposals,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useProposals({ pageSize: 10 });

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isFetching || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return <Loader />;
  }

  if (status === "error") {
    return <div>{error?.message}</div>;
  }

  return (
    <div className="flex flex-col bg-neutral border border-line rounded-lg shadow-newDefault overflow-hidden">
      <div>
        <InfiniteScroll
          hasMore={hasNextPage}
          loadMore={onLoadMore}
          initialLoad={false}
          element="main"
        >
          {proposals?.map((proposal) => (
            <NearProposal
              key={`${proposal.id}-${proposal.status}`}
              proposal={proposal}
            />
          ))}
          {isFetchingNextPage && <Loader />}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default function NearProposals() {
  const router = useRouter();

  const onCreateProposalClicked = () => {
    router.push("/proposals/create");
  };

  return (
    <div className="flex flex-col max-w-[76rem]">
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-4 sm:mb-auto">
        <div className="flex flex-row justify-between w-full gap-4 items-center mb-4">
          <PageHeader headerText="All Proposals" />
          <UpdatedButton onClick={onCreateProposalClicked}>
            Create Proposal
          </UpdatedButton>
        </div>
      </div>
      <NearProposalsList />
    </div>
  );
}
