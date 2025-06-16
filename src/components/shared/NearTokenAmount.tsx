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

const DEFAULT_MIN_DIGITS = 4;

export default function NearTokenAmount({
  amount,
  maximumSignificantDigits,
  hideCurrency = false,
  compact = true,
  currency = NEAR_TOKEN.symbol,
  minimumFractionDigits,
  className,
}: Props) {
  const minDigits = useMemo(() => {
    return Math.min(
      minimumFractionDigits ?? DEFAULT_MIN_DIGITS,
      maximumSignificantDigits ?? DEFAULT_MIN_DIGITS
    );
  }, [minimumFractionDigits, maximumSignificantDigits]);

  const formattedNumber = useMemo(() => {
    const formattedNearAmount = formatNumber(
      amount,
      NEAR_TOKEN.decimals,
      maximumSignificantDigits,
      false,
      compact,
      minDigits,
      "stripIfInteger"
    );

    return formattedNearAmount;
  }, [amount, compact, maximumSignificantDigits, minDigits]);

  return (
    <span className={cn(className)}>
      {`${formattedNumber}${hideCurrency ? "" : ` ${currency}`} `}
    </span>
  );
}
