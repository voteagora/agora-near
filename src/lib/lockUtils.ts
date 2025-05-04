import Big from "big.js";
import { NEAR_NOMINATION_EXP } from "near-api-js/lib/utils/format";
import { NANO_SECONDS_IN_DAY, NANO_SECONDS_IN_YEAR } from "./constants";

export const getAPYFromGrowthRate = (growthRateNs: Big) => {
  try {
    const annualRatePercent = growthRateNs.mul(NANO_SECONDS_IN_YEAR).mul(100);
    return annualRatePercent.toFixed(2);
  } catch (error) {
    return "0";
  }
};

export const getEstimatedVeNearBalance = (
  principalAmount: string,
  numMonths: number,
  growthRateNs: string | Big
) => {
  if (numMonths <= 0 || !principalAmount || principalAmount === "0") {
    return principalAmount;
  }

  try {
    const nearAmount = Big(principalAmount);
    const annualRateDecimal = Big(growthRateNs).mul(NANO_SECONDS_IN_YEAR);
    const periodFraction = Big(numMonths).div(12); // fraction of a year
    const growthFactor = Big(1).add(annualRateDecimal.mul(periodFraction));
    const estimatedVeNearBalance = nearAmount.mul(growthFactor);
    return estimatedVeNearBalance.toFixed(NEAR_NOMINATION_EXP);
  } catch (error) {
    return "0";
  }
};

export const getFormattedUnlockDuration = (
  unlockDurationNs: string | bigint
) => {
  const durationInDays = Number(unlockDurationNs) / NANO_SECONDS_IN_DAY;

  if (durationInDays >= 30) {
    const months = Math.floor(durationInDays / 30);
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    return `${Math.ceil(durationInDays)} day${durationInDays > 1 ? "s" : ""}`;
  }
};
