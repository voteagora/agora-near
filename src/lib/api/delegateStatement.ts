import axios from "axios";
import { Endpoint } from "./constants";

type CreateDelegateStatementInput = {
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

type CreateDelegateStatementResponse = {
  success: boolean;
};

export const createDelegateStatement = async (
  input: CreateDelegateStatementInput
) => {
  const response = await axios.post<CreateDelegateStatementResponse>(
    Endpoint.DelegateStatement,
    input
  );

  return response.data;
};
