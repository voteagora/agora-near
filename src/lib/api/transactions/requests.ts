import axios from "axios";
import { Endpoint } from "../constants";
import { NetworkId } from "@near-wallet-selector/core";
import { GetTransactionHashResponse } from "./types";

export const getTransactionHash = async ({
  networkId,
  receiptId,
}: {
  networkId: NetworkId;
  receiptId: string;
}) => {
  const response = await axios.get<GetTransactionHashResponse>(
    `${Endpoint.Transactions}/hash?network_id=${networkId}&receipt_id=${receiptId}`
  );

  return response.data;
};
