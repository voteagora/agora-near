import { useMemo } from "react";
import { useReadHOSContract } from "./useReadHOSContract";
import Big from "big.js";
import { getIsEligibleToUnlock } from "@/lib/lockUtils";

export const useLockupPendingBalance = ({
  lockupAccountId,
}: {
  lockupAccountId?: string;
}) => {
  const [
    { data: pendingBalance, isLoading: isLoadingPendingBalance },
    { data: unlockTimestamp, isLoading: isLoadingUnlockTimestamp },
  ] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_pending_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_unlock_timestamp" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
  ]);

  const isEligibleToUnlock = useMemo(() => {
    if (!unlockTimestamp) return false;
    return getIsEligibleToUnlock(unlockTimestamp);
  }, [unlockTimestamp]);

  const hasPendingBalance = useMemo(
    () => pendingBalance && Big(pendingBalance).gt(0),
    [pendingBalance]
  );

  return useMemo(() => {
    return {
      isLoading: isLoadingPendingBalance || isLoadingUnlockTimestamp,
      pendingBalance,
      unlockTimestamp,
      isEligibleToUnlock,
      hasPendingBalance,
    };
  }, [
    isLoadingPendingBalance,
    isLoadingUnlockTimestamp,
    pendingBalance,
    unlockTimestamp,
    isEligibleToUnlock,
    hasPendingBalance,
  ]);
};
