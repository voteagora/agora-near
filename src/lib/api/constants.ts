const getApiUrl = () => {
  switch (process.env.NEXT_PUBLIC_AGORA_ENV) {
    case "prod":
      return "https://near-api-641188643433.us-west1.run.app/api"; // agora-near-25q4-prd
    case "august-prod":
      return "https://near-api-237405837378.us-west1.run.app/api"; // agora-near-25q2
    case "staging":
      return "https://near-api-174260176421.us-west1.run.app/api"; // agora-near-25q4
    case "dev":
      return "https://near-api-158107670134.us-west1.run.app/api";
    case "local":
      return "http://localhost:8080/api";
    default:
      throw new Error(`Unknown NEXT_PUBLIC_AGORA_ENV: ${process.env.NEXT_PUBLIC_AGORA_ENV}, so API is unknown.`);
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
