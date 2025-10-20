import { useMemo } from "react";
import { useReadHOSContract } from "./useReadHOSContract";
import Big from "big.js";

export const useLiquidLockupBalance = ({
  lockupAccountId,
}: {
  lockupAccountId?: string;
}) => {
  const [
    { data: liquidOwnersBalance, isLoading: isLoadingLiquidOwnersBalance },
    { data: venearLiquidBalance, isLoading: isLoadingVenearLiquidBalance },
  ] = useReadHOSContract([
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_liquid_owners_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
    {
      contractId: lockupAccountId ?? "",
      methodName: "get_venear_liquid_balance" as const,
      config: {
        args: {},
        enabled: !!lockupAccountId,
      },
    },
  ]);

  const isLoading =
    isLoadingLiquidOwnersBalance || isLoadingVenearLiquidBalance;

  const availableToWithdraw = useMemo(() => {
    return Big(liquidOwnersBalance ?? "0").lt(venearLiquidBalance ?? "0")
      ? liquidOwnersBalance
      : venearLiquidBalance;
  }, [liquidOwnersBalance, venearLiquidBalance]);

  return useMemo(
    () => ({
      isLoading,
      liquidLockupBalance: {
        withdrawableNearBalance: availableToWithdraw,
        stakableNearBalance: liquidOwnersBalance,
        lockableNearBalance: venearLiquidBalance,
      },
    }),
    [availableToWithdraw, isLoading, liquidOwnersBalance, venearLiquidBalance]
  );
};
