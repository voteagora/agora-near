import { useTransferLockup } from "@/hooks/useTransferLockup";
import { NEAR_TOKEN_METADATA } from "@/lib/constants";
import { LockupLiquidBalance } from "@/lib/types";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import TokenAmount from "../shared/TokenAmount";
import { ResponsiveAssetRow } from "./ResponsiveAssetRow";

export const LockupLiquidNearRow = ({
  lockupAccountId,
  liquidLockupBalance,
  onStakeClick,
  onLockClick,
}: {
  lockupAccountId?: string | null;
  liquidLockupBalance: LockupLiquidBalance;
  onStakeClick: () => void;
  onLockClick: (accountId?: string | null) => void;
}) => {
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
    transferLockup({ amount: liquidLockupBalance.withdrawableNearBalance });
  }, [transferLockup, liquidLockupBalance.withdrawableNearBalance]);

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
      subtitle: (
        <TokenAmount
          amount={liquidLockupBalance.withdrawableNearBalance ?? "0"}
          maximumSignificantDigits={4}
          minimumFractionDigits={4}
        />
      ),
    };
  }, [liquidLockupBalance.withdrawableNearBalance]);

  const availableToStakeCol = useMemo(() => {
    return {
      title: "Available to stake",
      subtitle: (
        <TokenAmount
          amount={liquidLockupBalance.stakableNearBalance ?? "0"}
          maximumSignificantDigits={4}
          minimumFractionDigits={4}
        />
      ),
    };
  }, [liquidLockupBalance.stakableNearBalance]);

  const columns = useMemo(
    () => [
      {
        title: "Lockable",
        subtitle: (
          <TokenAmount
            amount={liquidLockupBalance.lockableNearBalance ?? "0"}
            currency={NEAR_TOKEN_METADATA.symbol}
            maximumSignificantDigits={4}
            minimumFractionDigits={4}
          />
        ),
      },
      availableToStakeCol,
      availableToTransferCol,
    ],
    [
      liquidLockupBalance.lockableNearBalance,
      availableToStakeCol,
      availableToTransferCol,
    ]
  );

  return (
    <ResponsiveAssetRow
      metadata={NEAR_TOKEN_METADATA}
      columns={columns}
      showOverflowMenu={false}
      actionButtons={actionButtons}
    />
  );
};
