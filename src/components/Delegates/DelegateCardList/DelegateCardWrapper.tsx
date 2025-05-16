"use client";

import DelegateTabs from "../DelegatesTabs/DelegatesTabs";
import DelegateContent from "./DelegateContent";

const DelegateCardWrapper = () => {
  return (
    <DelegateTabs>
      <DelegateContent />
    </DelegateTabs>
  );
};

export const DelegateCardLoadingState = () => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl text-primary font-bold">Delegates</h1>
        <div className="flex flex-row gap-2">
          <span className="block w-[150px] h-[36px] rounded-full bg-tertiary/10 animate-pulse"></span>
          <span className="block w-[150px] h-[36px] rounded-full bg-tertiary/10 animate-pulse"></span>
          <span className="block w-[150px] h-[36px] rounded-full bg-tertiary/10 animate-pulse"></span>
        </div>
      </div>
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
