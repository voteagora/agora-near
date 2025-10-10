import { useCallback } from "react";

const BLOCK_EXPLORER_BLOCKS_URL = "nearblocks.io/txns";

export const useBlockExplorerUrl = () => {
  const getTransactionUrl = useCallback((txnHash: string) => {
    return `https://${BLOCK_EXPLORER_BLOCKS_URL}/${txnHash}`;
  }, []);

  return getTransactionUrl;
};
