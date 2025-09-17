import { getTransactionHash } from "@/lib/api/transactions/requests";
import { useBlockExplorerUrl } from "./useBlockExplorerUrl";
import { useNear } from "@/contexts/NearContext";
import { useCallback } from "react";

export const useNearBlocks = () => {
  const getTransactionUrl = useBlockExplorerUrl();
  const { networkId } = useNear();
  const openTransactionByReceiptId = useCallback(
    async (receiptId: string) => {
      const { transactionHash } = await getTransactionHash({
        networkId,
        receiptId,
      });

      const nearBlocksUrl = getTransactionUrl(transactionHash);
      window.open(nearBlocksUrl, "_blank");
    },
    [networkId, getTransactionUrl]
  );

  return { openTransactionByReceiptId };
};
