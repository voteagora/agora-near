export type DelegateStatement = {
  address: string;
  signature: string;
  payload: {
    delegateStatement: string;
    topIssues: {
      value: string;
      type: string;
    }[];
  };
  twitter: string;
  discord: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  warpcast: string;
  endorsed: boolean;
};
