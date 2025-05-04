import { UpdatedButton } from "@/components/Button";
import { Input } from "@/components/ui/input";
import { useLockNear } from "@/hooks/useLockNear";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useVenearConfig } from "@/hooks/useVenearConfig";
import { useVenearSnapshot } from "@/hooks/useVenearSnapshot";
import {
  getAPYFromGrowthRate,
  getEstimatedVeNearBalance,
  getFormattedUnlockDuration,
} from "@/lib/lockUtils";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import { utils } from "near-api-js";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import NearTokenAmount from "../shared/NearTokenAmount";

export function NearLockDialog({ closeDialog }: { closeDialog: () => void }) {
  const { lockupAccountId, availableToLock, isLoading } = useLockupAccount();
  const { growthRateNs } = useVenearSnapshot();
  const { unlockDuration } = useVenearConfig({ enabled: true });
  const [lockAmount, setLockAmount] = useState("");
  const [lockPeriod, setLockPeriod] = useState(0); // in months
  const [isLockingMax, setIsLockingMax] = useState(false);

  const { lockNear, isLockingNear, lockingNearError } = useLockNear({
    lockupAccountId: lockupAccountId || "",
    onSuccess: () => {
      toast.success("Lock successful");
      closeDialog();
    },
  });

  const handleLockAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLockingMax(false);
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setLockAmount(value);
    }
  };

  // Calculate APY as a percentage
  const annualAPY = useMemo(
    () => getAPYFromGrowthRate(growthRateNs),
    [growthRateNs]
  );

  // Calculate new veNEAR balance
  const estimatedVeNearBalance = useMemo(() => {
    if (!lockAmount) return "0";

    return getEstimatedVeNearBalance(lockAmount, lockPeriod, growthRateNs);
  }, [lockAmount, lockPeriod, growthRateNs]);

  const handleLockNear = useCallback(() => {
    try {
      if (isLockingMax) {
        lockNear({});
        return;
      }

      const yoctoAmount = utils.format.parseNearAmount(lockAmount);
      if (!yoctoAmount) throw new Error("Invalid amount");

      lockNear({ amount: yoctoAmount });
    } catch (error) {
      toast.error("Failed to lock NEAR");
    }
  }, [lockAmount, lockNear, isLockingMax]);

  // Format available NEAR amount
  const availableNearAmount = useMemo(() => {
    return availableToLock ?? "0";
  }, [availableToLock]);

  // Handle setting max amount
  const handleSetMaxAmount = useCallback(() => {
    if (availableToLock) {
      const maxAmount = utils.format.formatNearAmount(availableToLock);
      setLockAmount(maxAmount);
      setIsLockingMax(true);
    }
  }, [availableToLock]);

  // Format unlock duration for display
  const formattedUnlockDuration = useMemo(
    () => getFormattedUnlockDuration(unlockDuration),
    [unlockDuration]
  );

  const formattedEstVenearBalance = useMemo(
    () => (
      <NearTokenAmount
        amount={utils.format.parseNearAmount(estimatedVeNearBalance) ?? "0"}
        hideCurrency
      />
    ),
    [estimatedVeNearBalance]
  );

  return (
    <div className="flex flex-col items-center w-full bg-neutral max-w-[28rem]">
      <div className="flex flex-col gap-6 justify-center min-h-[318px] w-full">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold text-left text-primary">
            Create New Lock
          </p>
          <div className="flex flex-col">
            <div className="relative flex h-[200px] flex-col border border-line rounded-lg">
              <div className="flex-1 flex">
                <div className="flex flex-row w-full items-center p-4">
                  <div className="flex flex-1 flex-col items-start gap-1">
                    <span className="font-medium">NEAR</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 pl-4">
                    <div className="flex flex-row items-center">
                      <Input
                        type="text"
                        placeholder="0"
                        value={lockAmount}
                        onChange={handleLockAmountChange}
                        className="w-full border-none text-lg"
                      />
                      <button
                        onClick={handleSetMaxAmount}
                        className="ml-2 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 rounded"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-10 h-10 flex items-center justify-center bg-neutral border border-line rounded-full">
                  <ArrowDownIcon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="border-t border-line"></div>
              <div className="flex-1 flex">
                <div className="flex flex-row w-full items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">veNEAR (est.)</span>
                  </div>
                  <span className="text-lg">{formattedEstVenearBalance}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-1 w-full">
            <div className="flex items-center">
              <div className="w-32 mr-4 flex-shrink-0">
                <span className="text-secondary font-medium">
                  Available to lock
                </span>
              </div>
              <div className="flex-1">
                <span className="text-primary font-medium">
                  <NearTokenAmount amount={availableNearAmount} hideCurrency />
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-32 mr-4 flex-shrink-0">
                <span className="text-secondary font-medium">Annual APY</span>
              </div>
              <div className="flex-1">
                <span className="text-primary font-medium">{annualAPY}%</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-32 mr-4 flex-shrink-0">
                <label className="text-secondary font-medium">
                  Lock duration
                </label>
              </div>
              <div className="flex-1">
                <span className="font-medium">
                  {lockPeriod}{" "}
                  {lockPeriod > 1 || lockPeriod === 0 ? "months" : "month"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="72"
              value={lockPeriod}
              onChange={(e) => setLockPeriod(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <UpdatedButton
            type="primary"
            onClick={handleLockNear}
            disabled={
              isLockingNear ||
              !lockAmount ||
              lockAmount === "0" ||
              !lockupAccountId ||
              isLoading
            }
          >
            {isLockingNear
              ? "Locking NEAR..."
              : lockingNearError
                ? "Error locking NEAR - try again"
                : "Lock NEAR"}
          </UpdatedButton>
          <p className="text-sm text-secondary text-center">
            There is a {formattedUnlockDuration} unlocking period
          </p>
        </div>
      </div>
    </div>
  );
}
