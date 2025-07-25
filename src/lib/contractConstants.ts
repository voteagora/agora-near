// TODO: Eventually this will be a full config with testnet contracts, mainnet contracts, ABIs, etc...
export const TESTNET_CONTRACTS = {
  VENEAR_CONTRACT_ID: process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID ?? "",
  VOTING_CONTRACT_ID: process.env.NEXT_PUBLIC_NEAR_VOTING_CONTRACT_ID ?? "",
  STAKING_POOL_ID: process.env.NEXT_PUBLIC_NEAR_STAKING_POOL_ID ?? "",
};
