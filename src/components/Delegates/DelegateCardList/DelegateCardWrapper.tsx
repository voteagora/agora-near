import { memo, useMemo } from "react";
import DelegateTabs from "../DelegatesTabs/DelegatesTabs";
import DelegateContent from "./DelegateContent";

const DelegateCardWrapper = memo(() => {
  const delegates = useMemo(
    () => ({
      meta: {
        has_next: false,
        total_returned: 0,
        next_offset: 0,
      },
      data: [
        {
          address: "lighttea2007.testnet",
          votingPower: "100000000000000000000000",
          statement:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor velit vitae felis faucibus, vel dignissim.",
          participationRate: "0.5",
          numOfDelegators: "100",
          twitter: "NEAR",
          warpcast: "NEAR",
          discord: "NEAR",
        },
        {
          address: "looseyam4271.testnet",
          votingPower: "100000000000000000000000",
        },
        {
          address: "fararena9024.testnet",
          votingPower: "100000000000000000000000",
        },
      ],
    }),
    []
  );

  return (
    <DelegateTabs>
      <DelegateContent initialDelegates={delegates} />
    </DelegateTabs>
  );
});

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
