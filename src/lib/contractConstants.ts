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

  // Otherwise, use environment-specific config
  switch (process.env.NEXT_PUBLIC_AGORA_ENV) {
    case "prod":
      return {
        VENEAR_CONTRACT_ID: "", // TODO: Add prod contract ID
        VOTING_CONTRACT_ID: "", // TODO: Add prod voting contract ID
        STAKING_POOL_ID: "", // TODO: Add prod staking pool ID
      };
    case "august-prod":
      return {
        VENEAR_CONTRACT_ID: "", // TODO: Add august-prod contract ID
        VOTING_CONTRACT_ID: "", // TODO: Add august-prod voting contract ID
        STAKING_POOL_ID: "", // TODO: Add august-prod staking pool ID
      };
    case "staging":
      return {
        VENEAR_CONTRACT_ID: "", // TODO: Add staging contract ID
        VOTING_CONTRACT_ID: "", // TODO: Add staging voting contract ID
        STAKING_POOL_ID: "", // TODO: Add staging staking pool ID
      };
    case "dev":
      return {
        VENEAR_CONTRACT_ID: "", // TODO: Add dev contract ID
        VOTING_CONTRACT_ID: "", // TODO: Add dev voting contract ID
        STAKING_POOL_ID: "", // TODO: Add dev staking pool ID
      };
    case "local":
      return {
        VENEAR_CONTRACT_ID: "", // TODO: Add local/dev contract ID
        VOTING_CONTRACT_ID: "", // TODO: Add local/dev voting contract ID
        STAKING_POOL_ID: "", // TODO: Add local/dev staking pool ID
      };
    default:
      return {
        VENEAR_CONTRACT_ID: "", // TODO: Add default contract ID
        VOTING_CONTRACT_ID: "", // TODO: Add default voting contract ID
        STAKING_POOL_ID: "", // TODO: Add default staking pool ID
      };
  }
};

export const CONTRACTS = getContractConfig();
