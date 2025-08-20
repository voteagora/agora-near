import axios from "axios";
import { GenerateNonceInput, GenerateNonceResponse } from "./types";
import { Endpoint } from "../constants";

export const generateNonce = async (input: GenerateNonceInput) => {
  const { data } = await axios.post<GenerateNonceResponse>(
    `${Endpoint.Nonce}`,
    { account_id: input.account_id }
  );

  return data;
};
