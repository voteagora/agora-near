import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useNear } from "@/contexts/NearContext";
import { useReadHOSContract } from "./useReadHOSContract";

export function useUserVote(proposalId: number) {
  const { signedAccountId } = useNear();

  const [result] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
      methodName: "get_vote",
      config: {
        args: {
          account_id: signedAccountId || "",
          proposal_id: proposalId,
        },
        enabled: !!signedAccountId,
      },
    },
  ]);

  return {
    voteIndex: result.data,
    isLoading: result.isLoading,
    error: result.error,
  };
}
