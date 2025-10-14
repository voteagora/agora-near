import Big from "big.js";
import { useCallback, useEffect, useState } from "react";
import { useFetchProof } from "./useFetchProof";

export const useSnapshotVotingPower = ({
  accountId,
  blockHeight,
}: {
  accountId?: string;
  blockHeight?: number;
}) => {
  const [votingPower, setVotingPower] = useState<Big>(new Big(0));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchProof = useFetchProof();

  const computeVotingPower = useCallback(async () => {
    if (!accountId || !blockHeight) {
      setIsLoading(false);
      return;
    }

    try {
      const proof = await fetchProof(accountId, blockHeight);
      if (!proof) {
        setVotingPower(new Big(0));
        return;
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
    } finally {
      setIsLoading(false);
    }
  }, [accountId, blockHeight, fetchProof]);

  useEffect(() => {
    setIsLoading(true);
    computeVotingPower();
  }, [computeVotingPower]);

  return { votingPower, isLoading };
};
