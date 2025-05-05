"use client";

import PageHeader from "@/components/Layout/PageHeader/PageHeader";
import { useProposals } from "@/hooks/useProposals";
import { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { NearProposal } from "./NearProposal";
import { UpdatedButton } from "@/components/Button";
import { PlusIcon } from "lucide-react";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";

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
  const openDialog = useOpenDialog();

  const handleOpenModal = () => {
    openDialog({
      type: "NEAR_PROPOSAL",
    });
  };

  return (
    <div className="flex flex-col max-w-[76rem]">
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-4 sm:mb-auto">
        <div className="flex flex-row gap-8 items-center mb-4">
          <PageHeader headerText="All Proposals" />
          <UpdatedButton
            onClick={handleOpenModal}
            type="secondary"
            className="mb-2"
            variant="rounded"
          >
            <PlusIcon className="w-6 h-6" />
          </UpdatedButton>
        </div>
      </div>
      <NearProposalsList />
    </div>
  );
}
