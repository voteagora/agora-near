import { useMemo } from "react";
import { useReadHOSContract } from "./useReadHOSContract";

export const useLockupVersion = ({
  lockupAccountId,
}: {
  lockupAccountId?: string | null;
}) => {
  const [{ data, isLoading }] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_version" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
  ]);

  return useMemo(
    () => ({
      lockupVersion: data as number | undefined,
      isLoading,
    }),
    [data, isLoading]
  );
};
