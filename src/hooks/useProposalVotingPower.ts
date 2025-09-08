import { ProposalInfo } from "@/lib/contracts/types/voting";
import Big from "big.js";
import { useCallback, useEffect, useState } from "react";
import { useFetchProof } from "./useFetchProof";

export const useProposalVotingPower = ({
  accountId,
  proposal,
}: {
  accountId?: string;
  proposal: ProposalInfo;
}) => {
  const blockHeight = proposal.snapshot_and_state?.snapshot.block_height;

  const [votingPower, setVotingPower] = useState<Big>(new Big(0));
  const [isLoading, setIsLoading] = useState(true);
  const fetchProof = useFetchProof();

  const getVotingPower = useCallback(async () => {
    if (!blockHeight || !accountId) {
      return;
    }

    try {
      const proof = await fetchProof(accountId, blockHeight);

      if (!proof) {
        throw new Error("Account merkle proof not found");
      }

      let totalVotingPower = new Big(0);
      const proofData = proof?.[1]?.V0;

      if (!proofData?.delegation?.account_id) {
        totalVotingPower = totalVotingPower
          .plus(new Big(proofData?.balance?.near_balance || 0))
          .plus(new Big(proofData?.balance?.extra_venear_balance || 0));
      }

      if (proofData?.delegated_balance) {
        totalVotingPower = totalVotingPower
          .plus(new Big(proofData?.delegated_balance?.near_balance || 0))
          .plus(
            new Big(proofData?.delegated_balance?.extra_venear_balance || 0)
          );
      }

      setVotingPower(totalVotingPower);
    } catch {
      // Fetching proof will fail expectedly if the account is not registered to vote
    } finally {
      setIsLoading(false);
    }
  }, [accountId, blockHeight, fetchProof]);

  useEffect(() => {
    getVotingPower();
  }, [getVotingPower]);

  return {
    votingPower,
    isLoading,
  };
};
