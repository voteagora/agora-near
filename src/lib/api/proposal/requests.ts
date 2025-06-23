import axios from "axios";
import { Endpoint } from "../constants";
import { ProposalNonVotersRecord, ProposalVotingHistoryRecord } from "./types";

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
