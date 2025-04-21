import { useCallback, useMemo } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";

export const useLockNear = () => {
  const {
    mutate: mutateLockNear,
    isPending: isLockingNear,
    error: lockingNearError,
  } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const {
    mutate: mutateUnlockNear,
    isPending: isUnlockingNear,
    error: unlockingNearError,
  } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const lockNear = useCallback(
    (lockupAccountId: string, amount?: string) => {
      return mutateLockNear({
        contractId: lockupAccountId,
        methodCalls: [
          {
            methodName: "lock_near",
            args: {
              amount,
            },
            gas: "100 Tgas",
          },
        ],
      });
    },
    [mutateLockNear]
  );

  const unlockNear = useCallback(
    ({
      lockupAccountId,
      amount,
    }: {
      lockupAccountId: string;
      amount?: string;
    }) => {
      return mutateUnlockNear({
        contractId: lockupAccountId,
        methodCalls: [
          { methodName: "begin_unlock_near" as const, args: { amount } },
          { methodName: "end_unlock_near" as const, args: { amount } },
        ],
      });
    },
    [mutateUnlockNear]
  );
  return useMemo(() => {
    return {
      lockNear,
      unlockNear,
      isLockingNear,
      lockingNearError,
      isUnlockingNear,
      unlockingNearError,
    };
  }, [
    lockNear,
    unlockNear,
    isLockingNear,
    isUnlockingNear,
    lockingNearError,
    unlockingNearError,
  ]);
};
