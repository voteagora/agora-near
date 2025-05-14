"use client";

import { PaginationParams } from "@/app/lib/pagination";
import DelegationsContainer from "./DelegationsContainer";

interface Props {
  address: string;
}

const DelegationsContainerWrapper = ({ address }: Props) => {
  // TODO: Fetch from API

  return (
    <DelegationsContainer
      delegatees={[]}
      initialDelegators={{
        meta: {
          has_next: false,
          total_returned: 0,
          next_offset: 0,
        },
        data: [],
      }}
      fetchDelegators={async (pagination: PaginationParams) => {
        return {
          meta: {
            has_next: false,
            total_returned: 0,
            next_offset: 0,
          },
          data: [],
        };
      }}
    />
  );
};

export const DelegationsContainerSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse p-12 rounded-lg bg-tertiary/10">
      <div className="h-4 w-1/2 bg-tertiary/20 rounded-md"></div>
      <div className="h-4 w-1/3 bg-tertiary/20 rounded-md"></div>
    </div>
  );
};

export default DelegationsContainerWrapper;
