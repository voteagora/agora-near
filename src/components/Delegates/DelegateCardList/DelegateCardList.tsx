"use client";

import { DelegateChunk } from "@/app/api/common/delegates/delegate";
import { Delegation } from "@/app/api/common/delegations/delegation";
import { PaginatedResult, PaginationParams } from "@/app/lib/pagination";
import { DialogProvider } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { useAgoraContext } from "@/contexts/AgoraContext";
import { stripMarkdown } from "@/lib/sanitizationUtils";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import DelegateCard from "./DelegateCard";

interface Props {
  initialDelegates: PaginatedResult<DelegateChunk[]>;
}

export default function DelegateCardList({ initialDelegates }: Props) {
  const [delegates, setDelegates] = useState(initialDelegates.data);
  const { isDelegatesFiltering, setIsDelegatesFiltering } = useAgoraContext();

  useEffect(() => {
    setIsDelegatesFiltering(false);
    setDelegates(initialDelegates.data);
  }, [initialDelegates, setIsDelegatesFiltering]);

  const loadMore = async () => {};

  return (
    <DialogProvider>
      {/* @ts-ignore */}
      <InfiniteScroll
        className="grid grid-flow-row grid-cols-1 sm:grid-cols-3 justify-around sm:justify-between py-4 gap-4 sm:gap-8"
        hasMore={false}
        pageStart={1}
        loadMore={loadMore}
        loader={
          <div
            className="w-full h-full min-h-[140px] bg-wash rounded-xl text-tertiary flex items-center justify-center"
            key="loader"
          >
            Loading...
          </div>
        }
        element="div"
      >
        {delegates?.map((delegate, idx) => {
          let truncatedStatement = "";

          if (delegate?.statement?.payload) {
            const delegateStatement = (
              delegate?.statement?.payload as { delegateStatement: string }
            ).delegateStatement;

            const plainTextStatement = stripMarkdown(delegateStatement);
            truncatedStatement = plainTextStatement.slice(0, 120);
          }

          return (
            <DelegateCard
              key={idx}
              delegate={delegate}
              truncatedStatement={truncatedStatement}
              isDelegatesFiltering={isDelegatesFiltering}
            />
          );
        })}
      </InfiniteScroll>
    </DialogProvider>
  );
}
