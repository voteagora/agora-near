export const baseApiUrl = process.env.NEXT_PUBLIC_NEAR_API_ENDPOINT;

export const Endpoint = Object.freeze({
  GetProposalVotingHistory: `${baseApiUrl}/proposal-voting-history`,
});
