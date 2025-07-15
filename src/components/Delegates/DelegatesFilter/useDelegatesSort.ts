import { useQueryState } from "nuqs";
import { delegatesSortOptions } from "@/lib/constants";

export const useDelegatesSort = ({
  startTransition,
}: {
  startTransition: (callback: () => void) => void;
}) => {
  const [orderByParam, setOrderByParam] = useQueryState("order_by", {
    defaultValue: delegatesSortOptions.weightedRandom.sort,
    clearOnDefault: true,
    startTransition,
  });

  const handleSortChange = (value: string) => {
    setOrderByParam(
      value === delegatesSortOptions.weightedRandom.sort ? null : value,
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
