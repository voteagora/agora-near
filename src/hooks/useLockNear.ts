import { useCallback, useMemo } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";
import { useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";

type Props = {
  lockupAccountId: string;
  onSuccess?: () => void;
};

export const useLockNear = ({ lockupAccountId, onSuccess }: Props) => {
  const queryClient = useQueryClient();

  const onLockUnlockSuccess = useCallback(() => {
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
      }),
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
      }),
    ]);
    onSuccess?.();
  }, [lockupAccountId, queryClient, onSuccess]);

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
