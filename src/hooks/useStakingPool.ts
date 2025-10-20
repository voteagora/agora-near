import { useNear } from "@/contexts/NearContext";
import {
  CACHE_TTL,
  LINEAR_TOKEN_CONTRACT,
  STNEAR_TOKEN_CONTRACT,
  RNEAR_TOKEN_CONTRACT,
} from "@/lib/constants";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export const useStakingPool = () => {
  const { viewMethod } = useNear();

  const [
    { data: stNearPrice, isLoading: isLoadingStNearPrice },
    { data: liNearPrice, isLoading: isLoadingLiNearPrice },
    { data: rNearPrice, isLoading: isLoadingRnearPrice },
    { data: liNearDeposit, isLoading: isLoadingLinearDeposit },
    { data: stNearDeposit, isLoading: isLoadingStnearDeposit },
    { data: rNearDeposit, isLoading: isLoadingRnearDeposit },
  ] = useQueries({
    queries: [
      {
        queryKey: ["stnearPrice"],
        queryFn: () => {
          return viewMethod({
            contractId: STNEAR_TOKEN_CONTRACT,
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
            contractId: LINEAR_TOKEN_CONTRACT,
            method: "ft_price",
            args: {},
          }) as Promise<string | null>;
        },
        staleTime: CACHE_TTL.MEDIUM,
      },
      {
        queryKey: ["rnearPrice"],
        queryFn: () => {
          return viewMethod({
            contractId: RNEAR_TOKEN_CONTRACT,
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
            contractId: LINEAR_TOKEN_CONTRACT,
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
            contractId: STNEAR_TOKEN_CONTRACT,
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
        queryKey: ["rnearDeposit"],
        queryFn: () => {
          return viewMethod({
            contractId: RNEAR_TOKEN_CONTRACT,
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
      rNear: {
        price: rNearPrice,
        deposit: rNearDeposit,
      },
    }),
    [
      stNearPrice,
      liNearPrice,
      rNearPrice,
      stNearDeposit,
      liNearDeposit,
      rNearDeposit,
    ]
  );

  return {
    stakingPools,
    isLoading:
      isLoadingStNearPrice ||
      isLoadingLiNearPrice ||
      isLoadingRnearPrice ||
      isLoadingLinearDeposit ||
      isLoadingStnearDeposit ||
      isLoadingRnearDeposit,
  };
};
