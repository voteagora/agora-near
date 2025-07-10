import { useState } from "react";
import { cn } from "@/lib/utils";
import FilterResetListbox from "@/components/common/FilterResetListbox";
import { delegatesFilterOptions } from "@/lib/constants";
import { useDelegatesFilter } from "./useDelegatesFilter";
import { FilterIcon } from "lucide-react";
import { CheckmarkIcon } from "react-hot-toast";

type FilterButtonProps = {
  label: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
};

export const FilterButton = ({
  label,
  isActive = false,
  icon,
  onClick,
}: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "h-10 px-4 py-1.5 rounded-full flex justify-center items-center gap-1",
      isActive
        ? "bg-brandPrimary text-neutral"
        : "bg-neutral text-primary border border-secondary"
    )}
  >
    {icon}
    <span className="text-base font-medium leading-normal">{label}</span>
  </button>
);

export const DelegatesFilter = ({
  startTransitionFilter,
}: {
  startTransitionFilter: (callback: () => void) => void;
}) => {
  // Filter state
  const [isOpen, setIsOpen] = useState(false);
  const { filterParam, handleFilterChange, resetFilter } = useDelegatesFilter({
    startTransition: startTransitionFilter,
  });

  const onFilterClose = (status: boolean) => {
    setIsOpen(status);
  };

  return (
    <FilterResetListbox
      triggerLabel="Filter"
      triggerIcon={
        <FilterIcon
          className={
            filterParam !== delegatesFilterOptions.all.filter
              ? "stroke-primary sm:stroke-neutral"
              : "stroke-primary"
          }
        />
      }
      activeCount={filterParam !== delegatesFilterOptions.all.filter ? 1 : 0}
      onReset={resetFilter}
      isOpen={isOpen}
      onOpenChange={onFilterClose}
    >
      <div className="self-stretch px-2.5 py-6 bg-wash flex flex-col justify-start items-start">
        <div className="self-stretch inline-flex justify-start items-start gap-2.5 flex-wrap content-start">
          <FilterButton
            label={delegatesFilterOptions.all.value}
            isActive={filterParam === delegatesFilterOptions.all.filter}
            onClick={() =>
              handleFilterChange(delegatesFilterOptions.all.filter)
            }
          />
          <FilterButton
            label={delegatesFilterOptions.endorsed.value}
            isActive={filterParam === delegatesFilterOptions.endorsed.filter}
            onClick={() =>
              handleFilterChange(delegatesFilterOptions.endorsed.filter)
            }
            icon={
              <CheckmarkIcon
                className={
                  filterParam === delegatesFilterOptions.endorsed.filter
                    ? "fill-brandPrimary stroke-neutral"
                    : "fill-primary stroke-neutral"
                }
              />
            }
          />
        </div>
      </div>
    </FilterResetListbox>
  );
};
