import axios from "axios";
import { Endpoint } from "../constants";
import {
  CreateDelegateStatementInput,
  GetDelegateResponse,
  GetDelegatesResponse,
  CreateDelegateStatementResponse,
  GetVoteHistoryResponse,
  GetDelegationEventsResponse,
  GetHosActivityResponse,
} from "./types";

export const createDelegateStatement = async (
  input: CreateDelegateStatementInput
) => {
  const response = await axios.post<CreateDelegateStatementResponse>(
    Endpoint.DelegateStatement,
    input
  );

  return response.data;
};

export const getDelegate = async (address: string, networkId: string) => {
  const { data } = await axios.get<GetDelegateResponse>(
    `${Endpoint.Delegates}/${address}?networkId=${networkId}`
  );

  return data.delegate;
};

export const fetchDelegates = async (
  pageSize: number,
  page: number,
  orderBy: string | null
) => {
  const orderByParam = orderBy ? `&order_by=${orderBy}` : "";
  const { data } = await axios.get<GetDelegatesResponse>(
    `${Endpoint.Delegates}?page_size=${pageSize}&page=${page}${orderByParam}`
  );

  return data;
};

export const fetchVoteHistory = async (
  pageSize: number,
  page: number,
  address: string
) => {
  const { data } = await axios.get<GetVoteHistoryResponse>(
    `${Endpoint.Delegates}/${address}/voting-history?page_size=${pageSize}&page=${page}`
  );

  return data;
};

export const fetchDelegationFrom = async (
  pageSize: number,
  page: number,
  address: string
) => {
  const { data } = await axios.get<GetDelegationEventsResponse>(
    `${Endpoint.Delegates}/${address}/delegated-from?page_size=${pageSize}&page=${page}`
  );

  return data;
};

export const fetchDelegationTo = async (
  pageSize: number,
  page: number,
  address: string
) => {
  const { data } = await axios.get<GetDelegationEventsResponse>(
    `${Endpoint.Delegates}/${address}/delegated-to?page_size=${pageSize}&page=${page}`
  );

  return data;
};

export const fetchHosActivity = async (
  pageSize: number,
  page: number,
  address: string,
  networkId: string,
  contractId: string
) => {
  const { data } = await axios.get<GetHosActivityResponse>(
    `${Endpoint.Delegates}/${address}/hos-activity?page_size=${pageSize}&page=${page}&network_id=${networkId}&contract_id=${contractId}`
  );

  return data;
};
