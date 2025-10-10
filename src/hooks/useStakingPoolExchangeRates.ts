import { useNear } from "@/contexts/NearContext";
import { CACHE_TTL } from "@/lib/constants";
import { StakingPool } from "@/lib/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export const useStakingPoolExchangeRates = ({
  pools,
}: {
  pools: StakingPool[];
}) => {
  const { viewMethod, networkId } = useNear();

  const queryResults = useQueries({
    queries: [
      ...pools.map((pool) => ({
        queryKey: [`${pool.id}-price`],
        queryFn: () => {
          return viewMethod({
            contractId: pool.contract,
            method: pool.priceMethod ?? "ft_price",
            args: {},
          }) as Promise<string | null>;
        },
        staleTime: CACHE_TTL.MEDIUM,
      })),
    ],
  });

  const exchangeRateMap: Record<string, string | null> = useMemo(() => {
    return queryResults.reduce(
      (acc, result, index) => {
        acc[pools[index].id] = result.data ?? null;
        return acc;
      },
      {} as Record<string, string | null>
    );
  }, [pools, queryResults]);

  return {
    exchangeRateMap,
    isLoading: queryResults.some((result) => result.isLoading),
  };
};
