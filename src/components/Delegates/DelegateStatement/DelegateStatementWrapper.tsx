"use client";

import DelegateStatementContainer from "./DelegateStatementContainer";

interface Props {
  statement: string;
  topIssues: {
    value: string;
    type: string;
  }[];
  address: string;
}

const DelegateStatementWrapper = ({ statement, topIssues, address }: Props) => {
  return (
    <>
      <DelegateStatementContainer statement={statement} address={address} />
    </>
  );
};

export const DelegateStatementSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse p-12 rounded-lg bg-tertiary/10">
      <div className="h-4 w-1/2 bg-tertiary/20 rounded-md"></div>
      <div className="h-4 w-1/3 bg-tertiary/20 rounded-md"></div>
    </div>
  );
};

export default DelegateStatementWrapper;
