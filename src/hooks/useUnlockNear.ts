import { useCallback, useMemo } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";

type Props = {
  onSuccess?: () => void;
  lockupAccountId: string;
};

export const useUnlockNear = ({ onSuccess, lockupAccountId }: Props) => {
  const {
    mutateAsync: mutateUnlockNear,
    isPending: isUnlockingNear,
    error: unlockingNearError,
  } = useWriteHOSContract({
    contractType: "LOCKUP",
    onSuccess,
  });

  const beginUnlockNear = useCallback(
    ({ amount }: { amount?: string }) => {
      return mutateUnlockNear({
        contractId: lockupAccountId,
        methodCalls: [
          { methodName: "begin_unlock_near" as const, args: { amount } },
        ],
      });
    },
    [lockupAccountId, mutateUnlockNear]
  );

  return useMemo(() => {
    return {
      beginUnlockNear,
      isUnlockingNear,
      unlockingNearError,
    };
  }, [beginUnlockNear, isUnlockingNear, unlockingNearError]);
};
