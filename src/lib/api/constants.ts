export const baseApiUrl =
  process.env.NEXT_PUBLIC_AGORA_ENV === "dev"
    ? "https://near-api-158107670134.us-west1.run.app/api"
    : process.env.NEXT_PUBLIC_AGORA_ENV === "local"
      ? "http://localhost:8080/api"
      : "https://near-api-237405837378.us-west1.run.app/api";

export const Endpoint = Object.freeze({
  Proposals: `${baseApiUrl}/proposal`,
  DelegateStatement: `${baseApiUrl}/delegates/statement`,
  Delegates: `${baseApiUrl}/delegates`,
  Near: `${baseApiUrl}/near`,
  Staking: `${baseApiUrl}/staking`,
});
