"use client";

import { DialogProvider } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { DelegateProfile } from "@/lib/api/delegates/types";
import InfiniteScroll from "react-infinite-scroller";
import DelegateCard from "./DelegateCard";

interface Props {
  delegates?: DelegateProfile[];
  hasMore: boolean;
  onLoadMore: () => void;
  isDelegatesFiltering: boolean;
  orderByParam: string | null;
  filterParam: string | null;
}

export default function DelegateCardList({
  delegates,
  hasMore,
  onLoadMore,
  isDelegatesFiltering,
  orderByParam,
  filterParam,
}: Props) {
  return (
    <DialogProvider>
      <InfiniteScroll
        key={`${orderByParam}-${filterParam}`}
        className="grid grid-flow-row grid-cols-1 sm:grid-cols-3 justify-around sm:justify-between py-4 gap-4 sm:gap-8"
        hasMore={hasMore}
        pageStart={1}
        loadMore={onLoadMore}
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
          return (
            <DelegateCard
              key={idx}
              delegate={delegate}
              isDelegatesFiltering={isDelegatesFiltering}
            />
          );
        })}
      </InfiniteScroll>
    </DialogProvider>
  );
}
