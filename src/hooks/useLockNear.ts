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

  return useMemo(() => {
    return {
      lockNear,
      isLockingNear,
      lockingNearError,
      lockNearAsync,
    };
  }, [lockNear, isLockingNear, lockingNearError, lockNearAsync]);
};
