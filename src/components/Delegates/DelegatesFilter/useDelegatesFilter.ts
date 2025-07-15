import { useQueryState } from "nuqs";
import { delegatesFilterOptions } from "@/lib/constants";

export const useDelegatesFilter = ({
  startTransition,
}: {
  startTransition: (callback: () => void) => void;
}) => {
  const [filterParam, setFilterParam] = useQueryState("filter", {
    defaultValue: delegatesFilterOptions.all.filter,
    clearOnDefault: true,
    startTransition,
  });

  const handleFilterChange = (value: string) => {
    setFilterParam(value, { scroll: false, shallow: false });
  };

  const resetFilter = () => {
    setFilterParam(null, { scroll: false, shallow: false });
  };

  return {
    filterParam,
    handleFilterChange,
    resetFilter,
  };
};
