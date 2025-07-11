import { useQueryState } from "nuqs";
import { delegatesFilterOptions } from "@/lib/constants";

export const useDelegatesSort = () => {
  const [orderByParam, setOrderByParam] = useQueryState("order_by", {
    defaultValue: delegatesFilterOptions.weightedRandom.sort,
    clearOnDefault: true,
  });

  const handleSortChange = (value: string) => {
    setOrderByParam(
      value === delegatesFilterOptions.weightedRandom.sort ? null : value,
      { scroll: false, shallow: false }
    );
  };

  const resetSort = () => {
    setOrderByParam(null, { scroll: false, shallow: false });
  };

  return {
    orderByParam,
    handleSortChange,
    resetSort,
  };
};
