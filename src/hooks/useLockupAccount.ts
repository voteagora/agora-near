import { useNear } from "@/contexts/NearContext";
import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";

export const useLockupAccount = () => {
  const { signedAccountId } = useNear();

  const [
    {
      data: lockupAccountId,
      isLoading: isLoadingLockupAccountId,
      error: lockupAccountIdError,
    },
  ] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_lockup_account_id" as const,
      config: {
        args: { account_id: signedAccountId || "" },
        enabled: !!signedAccountId,
      },
    },
  ]);

  const [
    {
      data: venearLiquidBalance,
      isLoading: isLoadingVenearLiquidBalance,
      error: venearLiquidBalanceError,
    },
    {
      data: votingPower,
      isLoading: isLoadingVotingPower,
      error: votingPowerError,
    },
  ] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_liquid_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "ft_balance_of" as const,
      config: {
        args: { account_id: lockupAccountId ?? "" },
        enabled: !!lockupAccountId,
      },
    },
  ]);

  return {
    lockupAccountId,
    votingPower,
    availableToLock: venearLiquidBalance,
    isLoading:
      isLoadingLockupAccountId ||
      isLoadingVenearLiquidBalance ||
      isLoadingVotingPower,
    error: lockupAccountIdError || venearLiquidBalanceError || votingPowerError,
  };
};
