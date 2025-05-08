import { useCallback, useEffect, useState } from "react";
import { providers } from "near-api-js";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";
import { useNear } from "@/contexts/NearContext";

export const useNearSupplies = () => {
  const [isLoadingTotalSupply, setIsLoadingTotalSupply] = useState(true);
  const [totalSupply, setTotalSupply] = useState<string | undefined>(undefined);

  const { rpcUrl } = useNear();

  const [{ data: votableSupply, isLoading: isLoadingVotableSupply }] =
    useReadHOSContract([
      {
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        methodName: "ft_total_supply",
        config: { args: {} },
      },
    ]);

  const init = useCallback(async () => {
    const provider = new providers.JsonRpcProvider({ url: rpcUrl });
    const block = await provider.block({ finality: "final" });
    setTotalSupply(block.header.total_supply);

    setIsLoadingTotalSupply(false);
  }, [rpcUrl]);

  useEffect(() => {
    init();
  }, [init]);

  return {
    totalSupply,
    votableSupply,
    isLoading: isLoadingTotalSupply || isLoadingVotableSupply,
  };
};
