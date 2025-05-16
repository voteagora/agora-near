import { useNear } from "@/contexts/NearContext";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { VAccount } from "@/lib/contracts/types/venear";
import { MerkleProof } from "@/lib/contracts/types/common";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import Big from "big.js";
import { useCallback, useEffect, useState } from "react";

export const useProposalVotingPower = ({
  accountId,
  proposal,
}: {
  accountId?: string;
  proposal: ProposalInfo;
}) => {
  const blockHeight = proposal.snapshot_and_state?.snapshot.block_height;
  const { viewMethod } = useNear();
  const [votingPower, setVotingPower] = useState<Big>(new Big(0));
  const [isLoading, setIsLoading] = useState(true);

  const getVotingPower = useCallback(async () => {
    if (!blockHeight || !accountId) {
      return;
    }

    try {
      const proof = (await viewMethod({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        method: "get_proof",
        args: { account_id: accountId },
        blockId: blockHeight,
        useArchivalNode: true,
      })) as [MerkleProof, VAccount] | null;

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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, blockHeight, viewMethod]);

  useEffect(() => {
    getVotingPower();
  }, [getVotingPower]);

  return {
    votingPower,
    isLoading,
  };
};
