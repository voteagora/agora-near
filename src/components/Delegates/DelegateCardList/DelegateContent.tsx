"use client";

import { DelegateChunk } from "@/app/api/common/delegates/delegate";
import { PaginatedResult } from "@/app/lib/pagination";
import { useQueryState } from "nuqs";
import DelegateCardList from "./DelegateCardList";
import DelegateTable from "./DelegateTable";

interface Props {
  initialDelegates: PaginatedResult<DelegateChunk[]>;
}

export default function DelegateContent({ initialDelegates }: Props) {
  const [layout] = useQueryState("layout", {
    defaultValue: "grid",
  });
  return layout === "grid" ? (
    <DelegateCardList initialDelegates={initialDelegates} />
  ) : (
    <DelegateTable initialDelegates={initialDelegates} />
  );
}
