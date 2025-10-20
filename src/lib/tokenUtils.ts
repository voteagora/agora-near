import Big from "big.js";
import { NEAR_NOMINATION } from "near-api-js/lib/utils/format";

export const filterDust = ({
  amount,
  dustThreshold = 0.001,
}: {
  amount: string;
  dustThreshold?: number;
}) =>
  Big(amount).div(NEAR_NOMINATION.toString()).gte(dustThreshold) ? amount : "0";
