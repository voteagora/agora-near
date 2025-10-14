import { useNear } from "@/contexts/NearContext";
import { fetchHosActivity } from "@/lib/api/delegates/requests";
import { CONTRACTS } from "@/lib/contractConstants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type UseHosActivityParams = {
  address?: string;
  pageSize?: number;
  enabled?: boolean;
};

export const useHosActivity = ({
  address,
  pageSize = 10,
  enabled = true,
}: UseHosActivityParams) => {
  const { networkId } = useNear();

  const query = useInfiniteQuery({
    queryKey: ["hos-activity", address],
    queryFn: async ({ pageParam = 1 }) => {
      if (!address) {
        throw new Error("Address is required");
      }

      return fetchHosActivity(
        pageSize,
        pageParam,
        address,
        networkId,
        CONTRACTS.VENEAR_CONTRACT_ID
      );
    },
    getNextPageParam: (currentPage, _, pageParam) => {
      if (currentPage.count <= pageParam * pageSize) return undefined;

      return pageParam + 1;
    },
    enabled: enabled && !!address,
    initialPageParam: 1,
  });

  const activities = useMemo(
    () => query.data?.pages.flatMap((page) => page.hosActivity) ?? [],
    [query.data?.pages]
  );

  return {
    ...query,
    activities,
  };
};
