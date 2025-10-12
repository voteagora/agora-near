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
  stakingPoolId,
  onLockClick,
}: {
  lockupAccountId?: string;
  token: TokenWithBalance;
  stakingPoolId?: string | null;
  onLockClick: (tokenAccountId?: string) => void;
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

  const handleLockClick = useCallback(
    (tokenAccountId?: string) => {
      onLockClick(tokenAccountId);
    },
    [onLockClick]
  );

  const { transferLockup } = useTransferLockup({
    lockupAccountId: lockupAccountId ?? "",
    onSuccess: () => {
      toast.success("Withdraw complete");
    },
  });

  const handleWithdraw = useCallback(() => {
    transferLockup({ amount: availableToTransfer });
  }, [transferLockup, availableToTransfer]);

  const actionButtons = useMemo(
    () => [
      {
        title: token.type === "lst" ? "Lock" : "Lock & Stake",
        onClick: () => handleLockClick(token.accountId),
        disabled:
          !!stakingPoolId &&
          token.type === "lst" &&
          stakingPoolId !== token.accountId,
      },
      {
        title: "Withdraw",
        onClick: handleWithdraw,
      },
    ],
    [
      token.type,
      token.accountId,
      stakingPoolId,
      handleLockClick,
      handleWithdraw,
    ]
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
      availableToTransferCol,
    ],
    [token.balance, token.metadata?.symbol, availableToTransferCol]
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
