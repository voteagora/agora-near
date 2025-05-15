import { useNear } from "@/contexts/NearContext";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { MerkleProof } from "@/lib/contracts/types/common";
import { VAccount } from "@/lib/contracts/types/venear";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import Big from "big.js";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useProposalVotingPower = ({
  accountId,
  proposal,
}: {
  accountId: string;
  proposal: ProposalInfo;
}) => {
  const blockHeight = proposal.snapshot_and_state?.snapshot.block_height;

  const { viewMethod } = useNear();

  const [votingPower, setVotingPower] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  const getVotingPower = useCallback(async () => {
    if (!blockHeight) return null;

    const proof = await viewMethod({
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      method: "get_proof",
      args: { account_id: accountId },
      blockId: blockHeight,
      useArchivalNode: true,
    });

    let power = "0";
    const proofData = proof[1]["V0"];

    if (proofData?.delegation?.account_id) {
      const nearBalance = new Big(proofData.delegated_balance.near_balance);
      const extraBalance = new Big(
        proofData.delegated_balance.extra_venear_balance
      );
      power = nearBalance.plus(extraBalance).toString();
    } else {
      const nearBalance = new Big(proofData.balance.near_balance);
      const extraBalance = new Big(proofData.balance.extra_venear_balance);
      power = nearBalance.plus(extraBalance).toString();
    }

    setVotingPower(power);
    setIsLoading(false);
  }, [accountId, blockHeight, viewMethod]);

  useEffect(() => {
    getVotingPower();
  }, [getVotingPower]);

  return {
    votingPower,
    isLoading,
  };
};
