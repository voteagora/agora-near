import axios from "axios";
import { Endpoint } from "../constants";
import { Proposal, ProposalVotingHistoryRecord } from "./types";

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

export const fetchProposalChartData = async (proposalId: string) => {
  const response = await axios.get<{
    data: ProposalVotingHistoryRecord[];
  }>(`${Endpoint.Proposals}/${proposalId}/charts`);

  return response.data;
};
