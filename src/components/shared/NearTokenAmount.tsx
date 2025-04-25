import { NEAR_TOKEN } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  amount: string | bigint;
  maximumSignificantDigits?: number;
  hideCurrency?: boolean;
  currency?: string;
  compact?: boolean;
};

export default function NearTokenAmount({
  amount,
  maximumSignificantDigits = 2,
  hideCurrency = false,
  compact = true,
  currency = NEAR_TOKEN.symbol,
}: Props) {
  const formattedNumber = useMemo(() => {
    const formattedNearAmount = formatNumber(
      amount,
      NEAR_TOKEN.decimals,
      maximumSignificantDigits,
      false,
      compact
    );

    return formattedNearAmount;
  }, [amount, compact, maximumSignificantDigits]);

  return (
    <span>{`${formattedNumber}${hideCurrency ? "" : ` ${currency}`}`} </span>
  );
}
