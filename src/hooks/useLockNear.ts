import { useCallback, useMemo } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";

type Props = {
  lockupAccountId: string;
  onSuccess?: () => void;
};

export const useLockNear = ({ lockupAccountId, onSuccess }: Props) => {
  const onLockUnlockSuccess = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const {
    mutate: mutateLockNear,
    mutateAsync: mutateLockNearAsync,
    isPending: isLockingNear,
    error: lockingNearError,
  } = useWriteHOSContract({
    contractType: "LOCKUP",
    onSuccess: onLockUnlockSuccess,
  });

  const {
    mutate: mutateUnlockNear,
    isPending: isUnlockingNear,
    error: unlockingNearError,
  } = useWriteHOSContract({
    contractType: "LOCKUP",
    onSuccess: onLockUnlockSuccess,
  });

  const lockNear = useCallback(
    ({ amount }: { amount?: string }) => {
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
    [lockupAccountId, mutateLockNear]
  );

  const lockNearAsync = useCallback(
    ({ amount }: { amount?: string }) => {
      return mutateLockNearAsync({
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
    [lockupAccountId, mutateLockNearAsync]
  );

  const unlockNear = useCallback(
    ({ amount }: { amount?: string }) => {
      return mutateUnlockNear({
        contractId: lockupAccountId,
        methodCalls: [
          { methodName: "begin_unlock_near" as const, args: { amount } },
          { methodName: "end_unlock_near" as const, args: { amount } },
        ],
      });
    },
    [lockupAccountId, mutateUnlockNear]
  );
  return useMemo(() => {
    return {
      lockNear,
      unlockNear,
      isLockingNear,
      lockingNearError,
      isUnlockingNear,
      unlockingNearError,
      lockNearAsync,
    };
  }, [
    lockNear,
    unlockNear,
    isLockingNear,
    isUnlockingNear,
    lockingNearError,
    unlockingNearError,
    lockNearAsync,
  ]);
};
