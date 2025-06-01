import { useNear } from "@/contexts/NearContext";
import { useCallback } from "react";

const BLOCK_EXPLORER_BLOCKS_URL = "nearblocks.io/txns";

export const useBlockExplorerUrl = () => {
  const { networkId } = useNear();

  const getTransactionUrl = useCallback(
    (txnHash: string) => {
      return `https://${networkId === "testnet" ? "testnet." : ""}${BLOCK_EXPLORER_BLOCKS_URL}/${txnHash}`;
    },
    [networkId]
  );

  return getTransactionUrl;
};
