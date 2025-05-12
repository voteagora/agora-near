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

export type CreateDelegateStatementInput = {
  address: string;
  message: string;
  signature: string;
  publicKey: string;
  twitter: string;
  discord: string;
  email: string;
  warpcast: string;
  topIssues: {
    type: string;
    value: string;
  }[];
  agreeCodeConduct: boolean;
  statement: string;
};

export type CreateDelegateStatementResponse = {
  success: boolean;
};

export type DelegateProfile = {
  address: string;
  twitter?: string;
  discord?: string;
  email?: string;
  warpcast?: string;
  topIssues?: {
    type: string;
    value: string;
  }[];
  statement?: string;
  votingPower?: string;
  participationRate?: string;
  numOfDelegators?: string;
};

export type GetDelegateResponse = {
  delegate?: DelegateProfile;
};
