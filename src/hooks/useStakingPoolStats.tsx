import { useNear } from "@/contexts/NearContext";
import { getStakingPoolApy } from "@/lib/api/staking/requests";
import { StakingPool } from "@/lib/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

type StakingPoolStatsProps = {
  pools: StakingPool[];
};

export const useStakingPoolStats = ({ pools }: StakingPoolStatsProps) => {
  const { networkId, viewMethod } = useNear();

  const stakingApyResults = useQueries({
    queries: [
      ...pools.flatMap((pool) => [
        {
          queryKey: ["staking-apy", pool, networkId],
          queryFn: () =>
            getStakingPoolApy({
              networkId,
              contractId: pool.contract,
            }),
        },
      ]),
    ],
  });

  const stakingSupplyResults = useQueries({
    queries: [
      ...pools.flatMap((pool) => [
        {
          queryKey: ["staking-supply", pool, networkId],
          queryFn: () =>
            viewMethod({
              contractId: pool.contract,
              method: "ft_total_supply",
              args: {},
            }) as Promise<string | undefined | null>,
        },
      ]),
    ],
  });

  const stats = useMemo(
    () =>
      stakingApyResults.reduce(
        (acc, current, index) => {
          const poolId = pools[index].id;

          if (poolId) {
            acc[poolId] = {
              apy: current.data?.apy ?? 0,
              supply: stakingSupplyResults[index].data ?? "0",
            };
          }

          return acc;
        },
        {} as Record<string, { apy: number; supply: string }>
      ),
    [stakingApyResults, stakingSupplyResults, pools]
  );

  return {
    stats,
    isLoading:
      stakingApyResults.some((result) => result.isLoading) ||
      stakingSupplyResults.some((result) => result.isLoading),
    error:
      (stakingApyResults.find((result) => result.error) as
        | Error
        | null
        | undefined) ??
      (stakingSupplyResults.find((result) => result.error) as
        | Error
        | null
        | undefined),
  };
};
