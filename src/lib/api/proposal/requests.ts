import axios from "axios";
import { Endpoint } from "../constants";

interface ProposalVotingHistoryRecord {
  accountId: string;
  votingPower: string;
  voteOption: string;
}

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
