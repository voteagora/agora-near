import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import Big from "big.js";
import { useCallback, useMemo } from "react";
import TokenAmount from "../shared/TokenAmount";
import { ResponsiveAssetRow } from "./ResponsiveAssetRow";
import { TokenWithBalance } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useTransferLockup } from "@/hooks/useTransferLockup";
import toast from "react-hot-toast";

export const VeNearLiquidAssetRow = ({
  lockupAccountId,
  token,
  onStakeClick,
  onLockClick,
}: {
  lockupAccountId?: string;
  token: TokenWithBalance;
  onStakeClick: () => void;
  onLockClick: (accountId?: string) => void;
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

  const isLoadingAvailableToTransfer =
    isLoadingLiquidOwnersBalance || isLoadingVenearLiquidBalance;

  const availableToTransfer = useMemo(() => {
    if (isLoadingAvailableToTransfer) {
      return "0";
    }

    return Big(liquidOwnersBalance ?? "0").lt(venearLiquidBalance ?? "0")
      ? liquidOwnersBalance
      : venearLiquidBalance;
  }, [liquidOwnersBalance, venearLiquidBalance, isLoadingAvailableToTransfer]);

  const handleStakeClick = useCallback(() => {
    onStakeClick();
  }, [onStakeClick]);

  const { transferLockup } = useTransferLockup({
    lockupAccountId: lockupAccountId ?? "",
    onSuccess: () => {
      toast.success("Withdraw complete");
    },
  });

  const handleWithdraw = useCallback(() => {
    transferLockup({ amount: availableToTransfer });
  }, [transferLockup, availableToTransfer]);

  const handleLockClick = useCallback(
    () => onLockClick(lockupAccountId),
    [lockupAccountId, onLockClick]
  );

  const actionButtons = useMemo(
    () => [
      {
        title: "Lock",
        onClick: handleLockClick,
      },
      {
        title: "Stake",
        onClick: handleStakeClick,
      },
      {
        title: "Withdraw",
        onClick: handleWithdraw,
      },
    ],
    [handleLockClick, handleStakeClick, handleWithdraw]
  );

  const availableToTransferCol = useMemo(() => {
    return {
      title: (
        <>
          <div className="flex flex-row items-center gap-2">
            <span>Available to withdraw</span>
          </div>
        </>
      ),
      subtitle: isLoadingAvailableToTransfer ? (
        <Skeleton className="w-16 h-4" />
      ) : (
        <TokenAmount
          amount={availableToTransfer ?? "0"}
          maximumSignificantDigits={4}
          minimumFractionDigits={4}
        />
      ),
    };
  }, [availableToTransfer, isLoadingAvailableToTransfer]);

  const availableToStakeCol = useMemo(() => {
    return {
      title: "Available to stake",
      subtitle: isLoadingLiquidOwnersBalance ? (
        <Skeleton className="w-16 h-4" />
      ) : (
        <TokenAmount
          amount={liquidOwnersBalance ?? "0"}
          maximumSignificantDigits={4}
          minimumFractionDigits={4}
        />
      ),
    };
  }, [isLoadingLiquidOwnersBalance, liquidOwnersBalance]);

  const columns = useMemo(
    () => [
      {
        title: "Lockable",
        subtitle: (
          <TokenAmount
            amount={token.balance}
            currency={token.metadata?.symbol}
            maximumSignificantDigits={4}
            minimumFractionDigits={4}
          />
        ),
      },
      availableToStakeCol,
      availableToTransferCol,
    ],
    [
      token.balance,
      token.metadata?.symbol,
      availableToStakeCol,
      availableToTransferCol,
    ]
  );

  return (
    <ResponsiveAssetRow
      metadata={token.metadata}
      columns={columns}
      showOverflowMenu={false}
      actionButtons={actionButtons}
    />
  );
};
