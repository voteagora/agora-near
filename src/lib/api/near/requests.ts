import axios from "axios";
import { Endpoint } from "../constants";
import { NearPriceResponse } from "./types";

export const fetchNearPrice = async () => {
  const response = await axios.get<NearPriceResponse>(`${Endpoint.Near}/price`);

  return response.data;
};
