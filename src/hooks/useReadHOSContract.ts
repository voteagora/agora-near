import { LockupReadContractMethods } from "@/lib/contracts/types/lockup";
import { VenearReadContractMethods } from "@/lib/contracts/types/venear";
import { VotingReadContractMethods } from "@/lib/contracts/types/voting";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNear } from "../contexts/NearContext";
import { CACHE_TTL } from "@/lib/constants";

type CombinedMethods = VenearReadContractMethods &
  LockupReadContractMethods &
  VotingReadContractMethods;

/** Any valid view‐method name across all contracts */
export type MethodName = keyof CombinedMethods;

/** Args & Result for a given method */
export type MethodArgs<M extends MethodName> = CombinedMethods[M]["args"];
export type MethodResult<M extends MethodName> = CombinedMethods[M]["result"];

export interface ReadContractConfig<Args> {
  args: Args;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export type ReadContractQuery<M extends MethodName> = {
  contractId: string;
  methodName: M;
  config: ReadContractConfig<MethodArgs<M>>;
  blockId?: number;
  useArchivalNode?: boolean;
};

// Helper type to map a tuple of method names to their corresponding query results
type QueryResults<T extends readonly MethodName[]> = {
  [K in keyof T]: UseQueryResult<MethodResult<T[K]>, Error>;
};

export const READ_NEAR_CONTRACT_QK = "near-read";

export function useReadHOSContract<const T extends readonly MethodName[]>(
  queries: readonly [...{ [K in keyof T]: ReadContractQuery<T[K]> }]
): QueryResults<T> {
  const { viewMethod } = useNear();

  const mappedQueries = useMemo(
    () =>
      queries.map(
        ({ contractId, methodName, config, blockId, useArchivalNode }) => ({
          queryKey: [
            READ_NEAR_CONTRACT_QK,
            contractId,
            methodName,
            config.args,
            blockId,
            useArchivalNode,
          ] as const,
          queryFn: async () => {
            const res = await viewMethod({
              contractId,
              method: methodName,
              args: config.args,
              blockId,
              useArchivalNode,
            });
            return res as MethodResult<typeof methodName> | null | undefined;
          },
          enabled: config.enabled ?? true,
          staleTime: config.staleTime ?? CACHE_TTL.SHORT, // Cache for 5 minutes by default
          gcTime: config.gcTime,
        })
      ),
    [queries, viewMethod]
  );

  return useQueries({
    queries: mappedQueries,
  }) as QueryResults<T>;
}
