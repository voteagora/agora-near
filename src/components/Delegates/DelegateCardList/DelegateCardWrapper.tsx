import { delegatesFilterOptions } from "@/lib/constants";
import Tenant from "@/lib/tenant/tenant";
import { UIEndorsedConfig } from "@/lib/tenant/tenantUI";
import DelegateContent from "./DelegateContent";
import DelegateTabs from "../DelegatesTabs/DelegatesTabs";

const DelegateCardWrapper = async ({ searchParams }: { searchParams: any }) => {
  const { ui } = Tenant.current();

  const sort =
    Object.entries(delegatesFilterOptions).find(
      ([, value]) => value.sort === searchParams.orderBy
    )?.[1]?.sort || delegatesFilterOptions.weightedRandom.sort;

  const filters = {
    ...(searchParams.delegatorFilter && {
      delegator: searchParams.delegatorFilter,
    }),
    ...(searchParams.issueFilter && { issues: searchParams.issueFilter }),
    ...(searchParams.stakeholderFilter && {
      stakeholders: searchParams.stakeholderFilter,
    }),
  };

  const endorsedToggle = ui.toggle("delegates/endorsed-filter");
  if (endorsedToggle?.enabled) {
    const defaultFilter = (endorsedToggle.config as UIEndorsedConfig)
      .defaultFilter;
    filters.endorsed =
      searchParams?.endorsedFilter === undefined
        ? defaultFilter
        : searchParams.endorsedFilter === "true";
  }

  const delegates = {
    meta: {
      has_next: false,
      total_returned: 0,
      next_offset: 0,
    },
    data: [
      {
        address: "acc-1745564703-user1.testnet",
        votingPower: {
          total: "100000000000000000000000",
          direct: "100",
          advanced: "100",
        },
        statement: {
          endorsed: true,
          discord: "discord",
          payload: { delegateStatement: "A trustworthy delegate" },
          twitter: "agora",
        },
        citizen: false,
      },
      {
        address: "lighttea2007.testnet",
        votingPower: {
          total: "100000000000000000000000",
          direct: "100",
          advanced: "100",
        },
        statement: {
          endorsed: true,
          discord: "discord",
          payload: { delegateStatement: "A trustworthy delegate" },
          twitter: "agora",
        },
        citizen: false,
      },
      {
        address: "fararena9024.testnet",
        votingPower: {
          total: "100000000000000000000000",
          direct: "100",
          advanced: "100",
        },
        statement: {
          endorsed: true,
          discord: "discord",
          payload: { delegateStatement: "A trustworthy delegate" },
          twitter: "agora",
        },
        citizen: false,
      },
    ],
  };

  return (
    <DelegateTabs>
      <DelegateContent initialDelegates={delegates} />
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
