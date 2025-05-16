"use client";

import { PaginatedResult } from "@/app/lib/pagination";
import { DelegateProfile } from "@/lib/api/delegates/types";
import { useQueryState } from "nuqs";
import DelegateCardList from "./DelegateCardList";
import DelegateTable from "./DelegateTable";
import { useNearDelegates } from "@/hooks/useNearDelegates";
import { useCallback } from "react";

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
