import { CACHE_TTL } from "@/lib/constants";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import Big from "big.js";
import { useMemo } from "react";
import { useReadHOSContract } from "./useReadHOSContract";

interface VenearSnapshotResult {
  totalVenearBalance: {
    nearBalance: string;
    extraVenearBalance: string;
  };
  growthRateNs: Big;
  isLoading: boolean;
  error: Error | null;
}

export const useVenearSnapshot = ({
  enabled = true,
}: { enabled?: boolean } = {}): VenearSnapshotResult => {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_snapshot",
      config: {
        args: {},
        enabled,
        staleTime: CACHE_TTL.MEDIUM,
      },
    },
  ]);

  const growthRateNs = useMemo(() => {
    const growthRateFraction =
      data?.[1]?.V0?.venear_growth_config?.FixedRate?.annual_growth_rate_ns;

    const numerator = Big(growthRateFraction?.numerator || "0");
    const denominator = Big(growthRateFraction?.denominator || "1");

    if (denominator.eq(0)) {
      return Big(0);
    }

    return numerator.div(denominator);
  }, [data]);

  return useMemo(() => {
    return {
      totalVenearBalance: {
        nearBalance: data?.[1]?.V0?.total_venear_balance?.near_balance || "0",
        extraVenearBalance:
          data?.[1]?.V0?.total_venear_balance?.extra_venear_balance || "0",
      },
      growthRateNs,
      isLoading,
      error,
    };
  }, [data, growthRateNs, isLoading, error]);
};
