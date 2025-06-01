import { useReadHOSContract } from "./useReadHOSContract";

export const useAvailableToLock = ({
  lockupAccountId,
  enabled = true,
}: {
  lockupAccountId?: string | null;
  enabled?: boolean;
}) => {
  const [
    {
      data: availableToLock,
      isLoading: isLoadingAvailableToLock,
      error: availableToLockError,
      refetch: refetchAvailableToLock,
    },
  ] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_liquid_balance" as const,
      config: {
        args: {},
        enabled,
      },
    },
  ]);

  return {
    availableToLock,
    isLoadingAvailableToLock,
    availableToLockError,
    refetchAvailableToLock,
  };
};
