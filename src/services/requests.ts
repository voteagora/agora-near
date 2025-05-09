import axios from "axios";
import { Endpoint } from "./constants";

interface ProposalVotingHistoryRecord {
  id: string;
  proposalId: number;
  votingPower: string;
  voterId: string;
  voteOption: number;
}

export const fetchProposalVotingHistory = async (
  proposalId: string,
  pageSize: number,
  currentPage: number
) => {
  const response = await axios.get<{
    records: ProposalVotingHistoryRecord[];
    count: number;
  }>(
    `${Endpoint.GetProposalVotingHistory}/${proposalId}?page_size=${pageSize}&page=${currentPage}`
  );
  return response.data;
};
