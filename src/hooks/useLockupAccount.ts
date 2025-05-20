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

  return {
    lockupAccountId,
    isLoading: isLoadingLockupAccountId,
    error: lockupAccountIdError,
  };
};
