import { setupWalletSelector } from "@near-wallet-selector/core";
import { useEffect, useState } from "react";
import { NetworkId } from "@near-wallet-selector/core";
import { providers } from "near-api-js";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";

const networkId = "testnet" as NetworkId;

export const useNearSupplies = () => {
  const [isLoadingTotalSupply, setIsLoadingTotalSupply] = useState(true);
  const [totalSupply, setTotalSupply] = useState<string | undefined>(undefined);

  const [{ data: votableSupply, isLoading: isLoadingVotableSupply }] =
    useReadHOSContract([
      {
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        methodName: "ft_total_supply",
        config: { args: {} },
      },
    ]);

  const init = async () => {
    const selector = await setupWalletSelector({
      network: networkId,
      modules: [],
    });

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    const block = await provider.block({ finality: "final" });
    setTotalSupply(block.header.total_supply);

    setIsLoadingTotalSupply(false);
  };

  useEffect(() => {
    init();
  }, []);

  return {
    totalSupply,
    votableSupply,
    isLoading: isLoadingTotalSupply || isLoadingVotableSupply,
  };
};
