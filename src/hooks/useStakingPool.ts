import {
  LINEAR_TOKEN_CONTRACT_ID,
  STNEAR_TOKEN_CONTRACT_ID,
} from "@/components/Onboarding/HouseOfStakeOnboardingProvider";
import { useNear } from "@/contexts/NearContext";
import { CACHE_TTL } from "@/lib/constants";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export const useStakingPool = () => {
  const { viewMethod } = useNear();

  const [
    { data: stNearPrice, isLoading: isLoadingStNearPrice },
    { data: liNearPrice, isLoading: isLoadingLiNearPrice },
    { data: liNearDeposit, isLoading: isLoadingLinearDeposit },
    { data: stNearDeposit, isLoading: isLoadingStnearDeposit },
  ] = useQueries({
    queries: [
      {
        queryKey: ["stnearPrice"],
        queryFn: () => {
          return viewMethod({
            contractId: STNEAR_TOKEN_CONTRACT_ID,
            method: "get_st_near_price",
            args: {},
          }) as Promise<string | null>;
        },
        staleTime: CACHE_TTL.MEDIUM,
      },
      {
        queryKey: ["linearPrice"],
        queryFn: () => {
          return viewMethod({
            contractId: LINEAR_TOKEN_CONTRACT_ID,
            method: "ft_price",
            args: {},
          }) as Promise<string | null>;
        },
        staleTime: CACHE_TTL.MEDIUM,
      },
      {
        queryKey: ["linearDeposit"],
        queryFn: () => {
          return viewMethod({
            contractId: LINEAR_TOKEN_CONTRACT_ID,
            method: "storage_balance_bounds",
            args: {},
          }) as Promise<
            | {
                min?: string;
                max?: string;
              }
            | null
            | undefined
          >;
        },
        staleTime: CACHE_TTL.MEDIUM,
      },
      {
        queryKey: ["stnearDeposit"],
        queryFn: () => {
          return viewMethod({
            contractId: STNEAR_TOKEN_CONTRACT_ID,
            method: "storage_balance_bounds",
            args: {},
          }) as Promise<
            | {
                min?: string;
                max?: string;
              }
            | null
            | undefined
          >;
        },
        staleTime: CACHE_TTL.MEDIUM,
      },
    ],
  });

  const stakingPools = useMemo(
    () => ({
      stNear: {
        price: stNearPrice,
        deposit: stNearDeposit,
      },
      liNear: {
        price: liNearPrice,
        deposit: liNearDeposit,
      },
    }),
    [stNearPrice, liNearPrice, stNearDeposit, liNearDeposit]
  );

  return {
    stakingPools,
    isLoading:
      isLoadingStNearPrice ||
      isLoadingLiNearPrice ||
      isLoadingLinearDeposit ||
      isLoadingStnearDeposit,
  };
};
