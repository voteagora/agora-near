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

  const [issuesParam, setIssuesParam] = useQueryState("issues", {
    defaultValue: "",
    clearOnDefault: true,
    startTransition,
  });

  const handleFilterChange = (value: string) => {
    setFilterParam(value, { scroll: false, shallow: false });
  };

  const handleIssuesChange = (issues: string[]) => {
    if (issues.length > 0) {
      setIssuesParam(issues.join(","), { scroll: false, shallow: false });
    } else {
      setIssuesParam(null, { scroll: false, shallow: false });
    }
  };

  const resetFilter = () => {
    setFilterParam(null, { scroll: false, shallow: false });
    setIssuesParam(null, { scroll: false, shallow: false });
  };

  return {
    filterParam,
    issuesParam,
    handleFilterChange,
    handleIssuesChange,
    resetFilter,
  };
};
