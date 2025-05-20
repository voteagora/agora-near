"use client";

import { useNearDelegates } from "@/hooks/useNearDelegates";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import DelegateCardList from "./DelegateCardList";
import DelegateTable from "./DelegateTable";
import { DelegateCardLoadingState } from "./DelegateCardWrapper";

export default function DelegateContent() {
  const [layout] = useQueryState("layout", {
    defaultValue: "grid",
  });

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useNearDelegates({
      pageSize: 10,
    });

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isLoading || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <DelegateCardLoadingState />;
  }

  return layout === "grid" ? (
    <DelegateCardList
      delegates={data}
      hasMore={hasNextPage}
      onLoadMore={onLoadMore}
    />
  ) : (
    <DelegateTable
      delegates={data}
      hasMore={hasNextPage}
      onLoadMore={onLoadMore}
    />
  );
}
