import { useNear } from "@/contexts/NearContext";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { MerkleProof } from "@/lib/contracts/types/common";
import { VAccount } from "@/lib/contracts/types/venear";
import { useCallback } from "react";

export const useFetchProof = () => {
  const { viewMethod } = useNear();

  const fetchProof = useCallback(
    async (accountId: string, blockHeight: number) => {
      const proof = (await viewMethod({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        method: "get_proof",
        args: { account_id: accountId },
        blockId: blockHeight,
        useArchivalNode: true,
      })) as [MerkleProof, VAccount] | null;

      return proof;
    },
    [viewMethod]
  );

  return fetchProof;
};
