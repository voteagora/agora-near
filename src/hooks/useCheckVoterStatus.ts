import { CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";
import { useNear } from "@/contexts/NearContext";
import { useMemo } from "react";

export const useCheckVoterStatus = ({ enabled }: { enabled: boolean }) => {
  const { signedAccountId } = useNear();
  const [{ data: accountInfo, isLoading }] = useReadHOSContract([
    {
      contractId: CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_account_info" as const,
      config: {
        args: { account_id: signedAccountId || "" },
        enabled: enabled && !!signedAccountId,
      },
    },
  ]);

  return useMemo(
    () => ({
      isRegisteredToVote: !!accountInfo,
      isLoading,
    }),
    [accountInfo, isLoading]
  );
};
