import { NEAR_TOKEN } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  amount: string | bigint;
  maximumSignificantDigits?: number;
  hideCurrency?: boolean;
  currency?: string;
  compact?: boolean;
  minimumFractionDigits?: number;
  className?: string;
};

export default function NearTokenAmount({
  amount,
  maximumSignificantDigits = 2,
  hideCurrency = false,
  compact = true,
  currency = NEAR_TOKEN.symbol,
  minimumFractionDigits,
  className,
}: Props) {
  const formattedNumber = useMemo(() => {
    const formattedNearAmount = formatNumber(
      amount,
      NEAR_TOKEN.decimals,
      maximumSignificantDigits,
      false,
      compact,
      minimumFractionDigits
    );

    return formattedNearAmount;
  }, [amount, compact, maximumSignificantDigits, minimumFractionDigits]);

  return (
    <span className={cn(className)}>
      {`${formattedNumber}${hideCurrency ? "" : ` ${currency}`}`}
    </span>
  );
}
