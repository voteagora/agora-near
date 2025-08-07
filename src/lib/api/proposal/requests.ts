import axios from "axios";
import { Endpoint } from "../constants";
import {
  Proposal,
  ProposalVotingHistoryRecord,
  ProposalNonVotersRecord,
} from "./types";
import { getRpcUrl } from "@/lib/utils";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { ProposalInfo } from "@/lib/contracts/types/voting";

export const fetchApprovedProposals = async (
  pageSize: number,
  currentPage: number
) => {
  const response = await axios.get<{
    proposals: Proposal[];
    count: number;
  }>(
    `${Endpoint.Proposals}/approved?page_size=${pageSize}&page=${currentPage}`
  );

  return response.data;
};

export const fetchPendingProposals = async (
  pageSize: number,
  currentPage: number,
  createdBy?: string
) => {
  const response = await axios.get<{
    proposals: Proposal[];
    count: number;
  }>(
    `${Endpoint.Proposals}/pending?page_size=${pageSize}&page=${currentPage}${createdBy ? `&created_by=${createdBy}` : ""}`
  );

  return response.data;
};

export const fetchProposalVotes = async (
  proposalId: string,
  pageSize: number,
  currentPage: number
) => {
  const response = await axios.get<{
    votes: ProposalVotingHistoryRecord[];
    count: number;
  }>(
    `${Endpoint.Proposals}/${proposalId}/votes?page_size=${pageSize}&page=${currentPage}`
  );

  return response.data;
};

export const fetchProposalNonVoters = async (
  proposalId: string,
  pageSize: number,
  currentPage: number
) => {
  const response = await axios.get<{
    nonVoters: ProposalNonVotersRecord[];
    count: number;
  }>(
    `${Endpoint.Proposals}/${proposalId}/non-voters?page_size=${pageSize}&page=${currentPage}`
  );

  return response.data;
};
export const fetchProposalChartData = async (proposalId: string) => {
  const response = await axios.get<{
    data: ProposalVotingHistoryRecord[];
  }>(`${Endpoint.Proposals}/${proposalId}/charts`);

  return response.data;
};

export const fetchProposal = async (proposalId: string) => {
  const rpcUrl = getRpcUrl(
    process.env.NEXT_PUBLIC_AGORA_ENV === "prod" ? "mainnet" : "testnet",
    {
      useArchivalNode: true,
    }
  );

  const jsonRpcProvider = new JsonRpcProvider({ url: rpcUrl });

  const res = await jsonRpcProvider.query({
    request_type: "call_function",
    finality: "optimistic",
    account_id: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
    method_name: "get_proposal",
    args_base64: Buffer.from(
      JSON.stringify({ proposal_id: Number(proposalId) })
    ).toString("base64"),
  });

  const resultArray = (res as any)?.result;
  const proposal = resultArray
    ? JSON.parse(Buffer.from(resultArray).toString())
    : null;

  return proposal as ProposalInfo | null;
};
