const getApiUrl = () => {
  switch (process.env.NEXT_PUBLIC_AGORA_ENV) {
    case "prod":
      return "https://near-api-237405837378.us-west1.run.app/api";
    case "august-prod":
      return "https://TBD-august-prod.run.app/api"; // TODO: Replace with actual URL
    case "staging":
      return "https://TBD-staging.run.app/api"; // TODO: Replace with actual URL
    case "dev":
      return "https://near-api-158107670134.us-west1.run.app/api";
    case "local":
      return "http://localhost:8080/api";
    default:
      return "https://near-api-237405837378.us-west1.run.app/api";
  }
};

export const baseApiUrl = getApiUrl();

export const Endpoint = Object.freeze({
  Proposals: `${baseApiUrl}/proposal`,
  DraftProposals: `${baseApiUrl}/proposal/draft`,
  DelegateStatement: `${baseApiUrl}/delegates/statement`,
  Delegates: `${baseApiUrl}/delegates`,
  Near: `${baseApiUrl}/near`,
  Staking: `${baseApiUrl}/staking`,
  Nonce: `${baseApiUrl}/nonce`,
  Transactions: `${baseApiUrl}/transactions`,
});
