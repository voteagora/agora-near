import {
  LINEAR_TOKEN_CONTRACT_ID,
  STNEAR_TOKEN_CONTRACT_ID,
} from "@/components/Onboarding/HouseOfStakeOnboardingProvider";
import { useNear } from "@/contexts/NearContext";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export const useStakingPoolConversionRates = () => {
  const { viewMethod } = useNear();

  const [
    { data: stNearPrice, isLoading: isLoadingStNearPrice },
    { data: liNearPrice, isLoading: isLoadingLiNearPrice },
  ] = useQueries({
    queries: [
      {
        queryKey: ["stNearPrice"],
        queryFn: () => {
          return viewMethod({
            contractId: STNEAR_TOKEN_CONTRACT_ID,
            method: "get_st_near_price",
            args: {},
          }) as Promise<string | null>;
        },
      },
      {
        queryKey: ["liNearPrice"],
        queryFn: () => {
          return viewMethod({
            contractId: LINEAR_TOKEN_CONTRACT_ID,
            method: "ft_price",
            args: {},
          }) as Promise<string | null>;
        },
      },
    ],
  });

  const conversionRates = useMemo(
    () => ({
      stNearPrice,
      liNearPrice,
    }),
    [stNearPrice, liNearPrice]
  );

  return {
    conversionRates,
    isLoading: isLoadingStNearPrice || isLoadingLiNearPrice,
  };
};
