import Tenant from "@/lib/tenant/tenant";
import { utils } from "near-api-js";
import { useMemo } from "react";
const { token } = Tenant.current();

type Props = {
  amount: string | bigint;
  maximumSignificantDigits?: number;
  hideCurrency?: boolean;
};

export default function NearTokenAmount({
  amount,
  maximumSignificantDigits = 2,
  hideCurrency = false,
}: Props) {
  const formattedNumber = useMemo(() => {
    return utils.format.formatNearAmount(
      String(amount),
      maximumSignificantDigits
    );
  }, [amount, maximumSignificantDigits]);

  return <span>{`${formattedNumber}${hideCurrency ? "" : ` NEAR`}`} </span>;
}
