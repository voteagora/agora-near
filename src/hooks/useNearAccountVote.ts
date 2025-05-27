import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useNear } from "@/contexts/NearContext";
import { useCallback, useEffect, useState } from "react";

export const useNearAccountVote = ({
  accountId,
  proposalId,
}: {
  accountId: string;
  proposalId: number;
}) => {
  const { viewMethod } = useNear();
  const [votedIndex, setVotedIndex] = useState<number | null>(null);

  const fetchVote = useCallback(async () => {
    if (!accountId || !proposalId) return;

    const vote = await viewMethod({
      contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
      method: "get_vote",
      args: {
        account_id: accountId,
        proposal_id: proposalId,
      },
    });

    setVotedIndex(vote);
  }, [viewMethod, accountId, proposalId]);

  useEffect(() => {
    fetchVote();
  }, [fetchVote]);

  return {
    votedIndex,
  };
};
