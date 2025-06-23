import { useReadHOSContract } from "./useReadHOSContract";

type Props = {
  lockupAccountId: string;
};

export const useAvailableToUnlock = ({ lockupAccountId }: Props) => {
  const [{ data: availableToUnlock, isLoading }] = useReadHOSContract([
    {
      contractId: lockupAccountId,
      methodName: "get_venear_locked_balance" as const,
      config: {
        args: {},
      },
    },
  ]);

  return {
    availableToUnlock,
    isLoading,
  };
};
