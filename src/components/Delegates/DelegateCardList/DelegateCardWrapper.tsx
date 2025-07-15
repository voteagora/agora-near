"use client";

import { useTransition } from "react";
import DelegateTabs from "../DelegatesTabs/DelegatesTabs";
import DelegateContent from "./DelegateContent";

const DelegateCardWrapper = () => {
  const [isPendingFilter, startTransitionFilter] = useTransition();
  const [isPendingSort, startTransitionSort] = useTransition();

  return (
    <DelegateTabs
      startTransitionFilter={startTransitionFilter}
      startTransitionSort={startTransitionSort}
    >
      <DelegateContent
        isPendingFilter={isPendingFilter}
        isPendingSort={isPendingSort}
      />
    </DelegateTabs>
  );
};

export const DelegateCardLoadingState = () => {
  return (
    <div>
      <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-3 justify-around sm:justify-between py-4 gap-4 sm:gap-8">
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
        <span className="block w-full h-[250px] rounded-lg bg-tertiary/10 animate-pulse"></span>
      </div>
    </div>
  );
};

export default DelegateCardWrapper;
