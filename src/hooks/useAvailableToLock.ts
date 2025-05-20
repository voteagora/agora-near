import { useReadHOSContract } from "./useReadHOSContract";

export const useAvailableToLock = ({
  lockupAccountId,
}: {
  lockupAccountId?: string;
}) => {
  const [
    {
      data: availableToLock,
      isLoading: isLoadingAvailableToLock,
      error: availableToLockError,
    },
  ] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_liquid_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
  ]);

  return {
    availableToLock,
    isLoadingAvailableToLock,
    availableToLockError,
  };
};
