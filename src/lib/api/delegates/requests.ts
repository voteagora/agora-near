import axios from "axios";
import { Endpoint } from "../constants";
import { CreateDelegateStatementInput, GetDelegateResponse } from "./types";
import { CreateDelegateStatementResponse } from "./types";

export const createDelegateStatement = async (
  input: CreateDelegateStatementInput
) => {
  const response = await axios.post<CreateDelegateStatementResponse>(
    Endpoint.DelegateStatement,
    input
  );

  return response.data;
};

export const getDelegate = async (address: string) => {
  const { data } = await axios.get<GetDelegateResponse>(
    `${Endpoint.Delegates}/${address}`
  );

  return data.delegate;
};
