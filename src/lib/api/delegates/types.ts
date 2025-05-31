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
  twitter?: string | null;
  discord?: string | null;
  email?: string | null;
  warpcast?: string | null;
  topIssues?:
    | {
        type: string;
        value: string;
      }[]
    | null;
  statement?: string | null;
  votingPower?: string | null;
  participationRate?: string | null;
  numOfDelegators?: string | null;
  forCount?: number | null;
  againstCount?: number | null;
};

export type GetDelegateResponse = {
  delegate?: DelegateProfile;
};

export type GetDelegatesResponse = {
  count: number;
  delegates: DelegateProfile[];
};

export type VoteHistory = {
  voteOption: string;
  votingPower: string;
  address: string;
  votedAt: Date;
  proposalId: string;
  proposalName: string | null;
};

export type GetVoteHistoryResponse = {
  count: number;
  votes: VoteHistory[];
};
