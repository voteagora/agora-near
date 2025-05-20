"use client";

import { useNearDelegates } from "@/hooks/useNearDelegates";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import DelegateCardList from "./DelegateCardList";
import DelegateTable from "./DelegateTable";

export default function DelegateContent() {
  const [layout] = useQueryState("layout", {
    defaultValue: "grid",
  });

  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } =
    useNearDelegates({
      pageSize: 10,
    });

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isFetching || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

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
