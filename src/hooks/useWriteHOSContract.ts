import { lockupMethodRequirements } from "@/lib/contracts/near/lockupConfig";
import { LockupWriteContractMethods } from "@/lib/contracts/near/lockupTypes";
import { venearMethodRequirements } from "@/lib/contracts/near/venearConfig";
import { VenearWriteContractMethods } from "@/lib/contracts/near/venearTypes";
import { votingMethodRequirements } from "@/lib/contracts/near/votingConfig";
import { VotingWriteContractMethods } from "@/lib/contracts/near/votingTypes";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useNear } from "../contexts/NearContext";

type CombinedMethods = VenearWriteContractMethods &
  LockupWriteContractMethods &
  VotingWriteContractMethods;

/** Any valid view‐method name across all contracts */
export type MethodName = keyof CombinedMethods;

/** Args & Result for a given method */
export type MethodArgs<M extends MethodName> = CombinedMethods[M]["args"];
export type MethodResult<M extends MethodName> = CombinedMethods[M]["result"];

export interface WriteContractConfig<Args> {
  args: Args;
  enabled?: boolean;
  gas?: string;
  deposit?: string;
}

// Type guards to narrow down method types
function isLockupMethod(
  method: MethodName
): method is keyof LockupWriteContractMethods {
  return method in lockupMethodRequirements;
}

function isVenearMethod(
  method: MethodName
): method is keyof VenearWriteContractMethods {
  return method in venearMethodRequirements;
}

function isVotingMethod(
  method: MethodName
): method is keyof VotingWriteContractMethods {
  return method in votingMethodRequirements;
}

export function useWriteHOSContract<M extends MethodName>(
  contractId: string,
  methodName: M,
  config: WriteContractConfig<MethodArgs<M>>
): UseQueryResult<MethodResult<M>, Error> {
  const { callMethod } = useNear();

  const defaultConfig = isLockupMethod(methodName)
    ? lockupMethodRequirements[methodName]
    : isVenearMethod(methodName)
      ? venearMethodRequirements[methodName]
      : isVotingMethod(methodName)
        ? votingMethodRequirements[methodName]
        : undefined;

  const {
    args,
    enabled = true,
    gas = defaultConfig?.gas,
    deposit = defaultConfig?.deposit,
  } = config ?? {};

  return useQuery({
    queryKey: ["near-write", contractId, methodName, args] as const,
    queryFn: async () => {
      const res = await callMethod({
        contractId,
        method: methodName,
        args,
        gas,
        deposit,
      });
      return res as MethodResult<M> | null | undefined;
    },
    enabled,
  });
}
