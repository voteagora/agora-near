import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useReadHOSContract } from "./useReadHOSContract";
import { useMemo } from "react";
import { CACHE_TTL } from "@/lib/constants";

export const useVenearConfig = ({ enabled }: { enabled: boolean }) => {
  const [{ data, isLoading, error }] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      methodName: "get_config",
      config: {
        args: {},
        enabled,
        staleTime: CACHE_TTL.LONG, // We can cache this more heavily as it won't change very often
      },
    },
  ]);

  const totalRegistrationCost = useMemo(() => {
    return (
      BigInt(data?.local_deposit || "0") +
      BigInt(data?.min_lockup_deposit || "0")
    );
  }, [data]);

  return useMemo(() => {
    return {
      totalRegistrationCost,
      venearStorageCost: BigInt(data?.local_deposit || "0"),
      lockupStorageCost: BigInt(data?.min_lockup_deposit || "0"),
      stakingPoolWhitelistId: data?.staking_pool_whitelist_account_id,
      unlockDuration: BigInt(data?.unlock_duration_ns || "0"),
      isLoading,
      error,
    };
  }, [totalRegistrationCost, isLoading, error, data]);
};
