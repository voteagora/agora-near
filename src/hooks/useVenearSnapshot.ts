import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";
import { useMemo } from "react";
import { CACHE_TTL } from "@/lib/constants";
import { Fraction } from "@/lib/contracts/types/common";
import Big from "big.js";

interface VenearSnapshotResult {
  // Total veNEAR balance including NEAR and veNEAR components
  totalVenearBalance: {
    nearBalance: string;
    extraVenearBalance: string;
  };

  // Annual growth rate in nanoseconds
  growthRateNs: Big;

  // Raw data
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
        staleTime: CACHE_TTL.SHORT,
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
    // The get_snapshot method returns [MerkleTreeSnapshot, VGlobalState]
    // We want to extract the VGlobalState (which is at index 1)
    const globalState = data?.[1]?.V0;

    return {
      totalVenearBalance: {
        nearBalance: globalState?.total_venear_balance?.near_balance || "0",
        extraVenearBalance:
          globalState?.total_venear_balance?.extra_venear_balance || "0",
      },
      growthRateNs,
      isLoading,
      error,
    };
  }, [data, isLoading, error]);
};
