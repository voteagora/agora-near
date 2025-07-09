"use client";

import { useDelegates } from "@/hooks/useDelegates";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import DelegateCardList from "./DelegateCardList";
import DelegateTable from "./DelegateTable";
import { DelegateCardLoadingState } from "./DelegateCardWrapper";

export default function DelegateContent({
  isPendingFilter,
  isPendingSort,
}: {
  isPendingFilter: boolean;
  isPendingSort: boolean;
}) {
  const [orderByParam] = useQueryState("order_by");
  const [filterParam] = useQueryState("filter");

  const [layout] = useQueryState("layout", {
    defaultValue: "grid",
  });

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useDelegates({
      pageSize: 10,
      orderBy: orderByParam,
      filter: filterParam,
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
      isDelegatesFiltering={isPendingFilter || isPendingSort}
      orderByParam={orderByParam}
      filterParam={filterParam}
    />
  ) : (
    <DelegateTable
      delegates={data}
      hasMore={hasNextPage}
      onLoadMore={onLoadMore}
      isDelegatesFiltering={isPendingFilter || isPendingSort}
      orderByParam={orderByParam}
      filterParam={filterParam}
    />
  );
}
