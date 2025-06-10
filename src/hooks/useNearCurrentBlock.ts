import { providers } from "near-api-js";
import { useCallback, useEffect, useState } from "react";
import { useRpcUrl } from "./useRpcUrl";

export const useNearCurrentBlock = () => {
  const [isLoadingBlockTime, setIsLoadingBlockTime] = useState(true);
  const [blockTime, setBlockTime] = useState<number | undefined>(undefined);
  const [blockHeight, setBlockHeight] = useState<number | undefined>(undefined);

  const rpcUrl = useRpcUrl({});

  const init = useCallback(async () => {
    const provider = new providers.JsonRpcProvider({ url: rpcUrl });
    const block = await provider.block({ finality: "final" });
    console.log(block);

    setBlockTime(block.header.timestamp);
    setBlockHeight(block.header.height);

    setIsLoadingBlockTime(false);
  }, [rpcUrl]);

  useEffect(() => {
    init();
  }, [init]);

  return {
    blockTime,
    blockHeight,
    isLoading: isLoadingBlockTime,
  };
};
