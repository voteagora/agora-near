import { lockupMethodRequirements } from "@/lib/contracts/near/lockupConfig";
import { LockupWriteContractMethods } from "@/lib/contracts/near/lockupTypes";
import { venearMethodRequirements } from "@/lib/contracts/near/venearConfig";
import { VenearWriteContractMethods } from "@/lib/contracts/near/venearTypes";
import { votingMethodRequirements } from "@/lib/contracts/near/votingConfig";
import { VotingWriteContractMethods } from "@/lib/contracts/near/votingTypes";
import { useMutation } from "@tanstack/react-query";
import { MethodCall, useNear } from "../contexts/NearContext";
import { MethodRequirementsConfig } from "@/lib/contracts/near/common";

type ContractMethodMap = {
  VENEAR: VenearWriteContractMethods;
  LOCKUP: LockupWriteContractMethods;
  VOTING: VotingWriteContractMethods;
};

type ContractType = keyof ContractMethodMap;

type ContractMethodType = {
  args: Record<string, unknown>;
  result: unknown;
};

type ContractSpecificMethodCall<
  T extends ContractType,
  M extends keyof ContractMethodMap[T] = keyof ContractMethodMap[T],
> = {
  methodName: M;
  args?: ContractMethodMap[T][M] extends ContractMethodType
    ? ContractMethodMap[T][M]["args"]
    : Record<string, unknown>;
  gas?: string;
  deposit?: string;
};

export type MethodName<T extends ContractType> = keyof ContractMethodMap[T];

const methodRequirementsMap = {
  VENEAR: venearMethodRequirements,
  LOCKUP: lockupMethodRequirements,
  VOTING: votingMethodRequirements,
} as const;

type MethodRequirements<T extends ContractType> = MethodRequirementsConfig<
  ContractMethodMap[T]
>;

export function useWriteHOSContract<T extends ContractType>({
  contractType,
}: {
  contractType: T;
}) {
  const { callMethods } = useNear();

  return useMutation({
    mutationFn: ({
      methodCalls,
      contractId,
    }: {
      methodCalls: ContractSpecificMethodCall<T>[];
      contractId: string;
    }) => {
      const methodRequirements = methodRequirementsMap[
        contractType
      ] as MethodRequirements<T>;

      const processedMethodCalls = methodCalls.map((call) => {
        const requirements =
          methodRequirements[
            call.methodName as keyof typeof methodRequirements
          ];
        return {
          ...call,
          gas: call.gas ?? requirements?.gas,
          deposit: call.deposit ?? requirements?.deposit,
        };
      });

      return callMethods({
        contractId,
        methodCalls: processedMethodCalls as MethodCall[],
      });
    },
  });
}
