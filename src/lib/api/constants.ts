export const baseApiUrl = process.env.NEXT_PUBLIC_NEAR_API_ENDPOINT;

export const Endpoint = Object.freeze({
  Proposals: `${baseApiUrl}/proposal`,
  DelegateStatement: `${baseApiUrl}/delegates/statement`,
  Delegates: `${baseApiUrl}/delegates`,
  Near: `${baseApiUrl}/near`,
});
