import axios from "axios";
import { Endpoint } from "../constants";
import {
  Proposal,
  ProposalVotingHistoryRecord,
  ProposalNonVotersRecord,
  DraftProposal,
  CreateDraftProposalRequest,
  UpdateDraftProposalRequest,
  GetDraftProposalsResponse,
} from "./types";

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

export const createDraftProposal = async (data: CreateDraftProposalRequest) => {
  const response = await axios.post<DraftProposal>(
    Endpoint.DraftProposals,
    data
  );
  return response.data;
};

export const fetchDraftProposals = async (params?: {
  author?: string;
  stage?: string;
  page?: number;
  pageSize?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.author) searchParams.set("author", params.author);
  if (params?.stage) searchParams.set("stage", params.stage);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.pageSize)
    searchParams.set("page_size", params.pageSize.toString());

  const response = await axios.get<GetDraftProposalsResponse>(
    `${Endpoint.DraftProposals}?${searchParams}`
  );
  return response.data;
};

export const fetchDraftProposal = async (id: string) => {
  const response = await axios.get<DraftProposal>(
    `${Endpoint.DraftProposals}/${id}`
  );
  return response.data;
};

export const updateDraftProposal = async (
  id: string,
  data: UpdateDraftProposalRequest
) => {
  const response = await axios.put<DraftProposal>(
    `${Endpoint.DraftProposals}/${id}`,
    data
  );
  return response.data;
};

export const deleteDraftProposal = async (id: string) => {
  await axios.delete(`${Endpoint.DraftProposals}/${id}`);
};
