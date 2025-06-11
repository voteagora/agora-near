import axios from "axios";
import { Endpoint } from "../constants";
import { NetworkId } from "@near-wallet-selector/core";

export const getStakingPoolApy = async ({
  networkId,
  contractId,
}: {
  networkId: NetworkId;
  contractId: string;
}) => {
  const response = await axios.get<{
    apy: number;
  }>(`${Endpoint.Staking}/apy?networkId=${networkId}&contractId=${contractId}`);

  return response.data;
};
