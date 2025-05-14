"use client";

import { PaginatedResult } from "@/app/lib/pagination";
import { DelegateProfile } from "@/lib/api/delegates/types";
import { useQueryState } from "nuqs";
import DelegateCardList from "./DelegateCardList";
import DelegateTable from "./DelegateTable";

interface Props {
  initialDelegates: PaginatedResult<DelegateProfile[]>;
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
