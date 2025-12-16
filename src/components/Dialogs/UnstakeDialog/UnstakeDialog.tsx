import { UpdatedButton } from "@/components/Button";
import TokenAmount from "@/components/shared/TokenAmount";
import { Input } from "@/components/ui/input";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import { useStakeNear } from "@/hooks/useStakeNear";
import { NEAR_TOKEN_METADATA, NEAR_TOKEN } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import Big from "big.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { UnstakeDialogHeader } from "./UnstakeDialogHeader";
import { AssetIcon } from "../../common/AssetIcon";
import Image from "next/image";


type UnstakeDialogProps = {
  closeDialog: () => void;
};

export const UnstakeDialog = ({ closeDialog }: UnstakeDialogProps) => {
  const [amount, setAmount] = useState("");
  const { lockupAccountId } = useLockupAccount();
  const { stakingPoolId } = useCurrentStakingPoolId({
    lockupAccountId: lockupAccountId ?? "",
    enabled: !!lockupAccountId,
  });

  const { stakedBalance } = useStakedBalance({
    stakingPoolId,
    accountId: lockupAccountId,
  });

  const {
    unstakeNear,
    isUnstakingNear,
    unstakingNearError,
    unstakeAll,
    isUnstakingAll,
  } = useStakeNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const handleUnstake = async () => {
    if (!amount || !lockupAccountId) return;
    try {
      // Basic validation
      if (Big(amount).lte(0)) {
        toast.error("Amount must be greater than 0");
        return;
      }
      if (Big(amount).gt(stakedBalance ?? "0")) {
        toast.error("Amount exceeds staked balance");
        return;
      }

      // Convert to yoctoNEAR (assuming input is in NEAR)
      // Note: useStakeNear expects yoctoNEAR string
      const amountYocto = Big(amount).mul(Big(10).pow(24)).toFixed(0);

      await unstakeNear(amountYocto);
      closeDialog();
      toast.success("Unstake transaction submitted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to unstake");
    }
  };

  const handleUnstakeAll = async () => {
    if (!lockupAccountId) return;
    try {
      await unstakeAll();
      closeDialog();
      toast.success("Unstake all transaction submitted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to unstake all");
    }
  };

  const handleMaxClick = () => {
    if (stakedBalance) {
      // Format to NEAR for display/input
      setAmount(Big(stakedBalance).div(Big(10).pow(24)).toFixed());
    }
  };

  const isLoading = isUnstakingNear || isUnstakingAll;

  return (
    <div className="flex flex-col gap-4 w-full">
      <UnstakeDialogHeader />
      
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-sm text-secondary">
            <span>Available to unstake</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-primary">
              <TokenAmount amount={stakedBalance ?? "0"} />
            </span>
          </div>
        </div>
      
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between rounded-lg border border-gray-200 p-4 gap-3 sm:gap-0">
          <div className="flex items-center gap-2 flex-shrink-0">
             <AssetIcon
                icon={NEAR_TOKEN_METADATA.icon}
                name={NEAR_TOKEN_METADATA.name}
              />
            <span className="font-medium">NEAR</span>
          </div>

          <div className="flex items-center flex-1 sm:ml-2 min-w-0">
             <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent border-none text-lg text-right h-auto focus-visible:ring-0 focus-visible:ring-offset-0 pr-2"
              />
              <button
                onClick={handleMaxClick}
                disabled={isLoading || !stakedBalance}
                className="px-3 py-1 text-sm text-[#00E391] hover:bg-[#00E391] hover:text-white rounded transition-colors duration-200 flex-shrink-0"
              >
                Max
              </button>
          </div>
        </div>
      </div>

      {unstakingNearError && (
        <div className="text-red-500 text-sm">{unstakingNearError.message}</div>
      )}

      <div className="flex-1 flex flex-col justify-end gap-2 mt-4">
        <UpdatedButton
          onClick={handleUnstake}
          type={(!amount || Big(amount ?? 0).eq(0)) ? "disabled" : "primary"}
          disabled={isLoading || !amount || Big(amount ?? 0).eq(0)}
          loading={isLoading}
          className="w-full"
          variant="rounded"
        >
          Unstake
        </UpdatedButton>
      </div>

    </div>
  );
};
