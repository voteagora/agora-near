type ContractConfig = {
  VENEAR_CONTRACT_ID: string;
  VOTING_CONTRACT_ID: string;
  STAKING_POOL_ID: string;
};

const getContractConfig = (): ContractConfig => {
  // Fallback to env vars if provided (for backwards compatibility during migration)
  const envContractId = process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID ?? "";
  const envVotingContractId =
    process.env.NEXT_PUBLIC_NEAR_VOTING_CONTRACT_ID ?? "";
  const envStakingPoolId = process.env.NEXT_PUBLIC_NEAR_STAKING_POOL_ID ?? "";

  // If env vars are set, use them (backwards compatibility)
  if (envContractId || envVotingContractId || envStakingPoolId) {
    return {
      VENEAR_CONTRACT_ID: envContractId,
      VOTING_CONTRACT_ID: envVotingContractId,
      STAKING_POOL_ID: envStakingPoolId,
    };
  }

  const STAKING_POOL_ID = "chorusone.pool.f863973.m0"
  const DEV_VENEAR_CONTRACT_ID = "vt.voteagora.near";
  const DEV_VOTING_CONTRACT_ID = "vote-dev.voteagora.near";

  // Otherwise, use environment-specific config
  switch (process.env.NEXT_PUBLIC_AGORA_ENV) {
    case "prod":
      return {
        VENEAR_CONTRACT_ID: "venear.dao",
        VOTING_CONTRACT_ID: "vote.dao",
        STAKING_POOL_ID
      };
    case "august-prod":
      return {
        VENEAR_CONTRACT_ID: "v.hos-07.testnet", // v.hos-07.testnet (old dev)
        VOTING_CONTRACT_ID: "vote.voteagora.near", // vote.hos-07.testnet (old dev)
        STAKING_POOL_ID
      };
    case "staging":
      return {
        VENEAR_CONTRACT_ID: "venear.stagingdao.near", 
        VOTING_CONTRACT_ID: "vote.stagingdao.near",
        STAKING_POOL_ID
      };
    case "dev":
      return {
        VENEAR_CONTRACT_ID: DEV_VENEAR_CONTRACT_ID,
        VOTING_CONTRACT_ID: DEV_VOTING_CONTRACT_ID,
        STAKING_POOL_ID
      };
    case "local":
      return {
        VENEAR_CONTRACT_ID: DEV_VENEAR_CONTRACT_ID,
        VOTING_CONTRACT_ID: DEV_VOTING_CONTRACT_ID,
        STAKING_POOL_ID
      };
    default:
      return {
        VENEAR_CONTRACT_ID: DEV_VENEAR_CONTRACT_ID,
        VOTING_CONTRACT_ID: DEV_VOTING_CONTRACT_ID,
        STAKING_POOL_ID
      };
  }
};

export const CONTRACTS = getContractConfig();
