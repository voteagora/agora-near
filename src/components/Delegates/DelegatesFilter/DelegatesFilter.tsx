"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { delegatesFilterOptions } from "@/lib/constants";
import { useAddSearchParam, useDeleteSearchParam } from "@/hooks";
import FilterListbox from "@/components/common/FilterListbox";

export default function DelegatesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();
  const deleteSearchParam = useDeleteSearchParam();
  const orderByParam = searchParams?.get("orderBy") || "weightedRandom";

  const handleChange = (value: string) => {
    router.push(
      value === delegatesFilterOptions.weightedRandom.sort
        ? deleteSearchParam({ name: "orderBy" })
        : addSearchParam({ name: "orderBy", value }),
      { scroll: false }
    );
  };

  return (
    <FilterListbox
      value={orderByParam}
      onChange={handleChange}
      options={delegatesFilterOptions}
    />
  );
}
