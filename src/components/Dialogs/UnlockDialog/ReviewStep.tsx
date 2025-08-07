import UnlockIcon from "@/assets/Locking.png";
import { UpdatedButton } from "@/components/Button";
import { TransactionError } from "@/components/TransactionError";
import { TooltipWithTap } from "@/components/ui/tooltip-with-tap";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { utils } from "near-api-js";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import TokenAmount from "../../shared/TokenAmount";
import { useUnlockProviderContext } from "../UnlockProvider";
import { UnlockWarning } from "./UnlockWarning";
import { usePrice } from "@/hooks/usePrice";
import Big from "big.js";
import { Skeleton } from "@/components/ui/skeleton";
import { useUnlockNear } from "@/hooks/useUnlockNear";
import { useQueryClient } from "@tanstack/react-query";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { NEAR_NOMINATION_EXP } from "near-api-js/lib/utils/format";

type ReviewStepProps = {
  handleEdit: () => void;
  handleViewDashboard: () => void;
};

export const ReviewStep = memo(
  ({ handleEdit, handleViewDashboard }: ReviewStepProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
      enteredAmount,
      nearAmount,
      lockupAccountId,
      formattedUnlockDuration,
    } = useUnlockProviderContext();

    const queryClient = useQueryClient();

    const { beginUnlockNear, isUnlockingNear, unlockingNearError } =
      useUnlockNear({
        lockupAccountId: lockupAccountId || "",
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              READ_NEAR_CONTRACT_QK,
              TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
            ],
          });
          queryClient.invalidateQueries({
            queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
          });
        },
      });

    const onSubmit = useCallback(async () => {
      try {
        setIsSubmitting(true);
        setError(null);

        const amountInYocto = utils.format.parseNearAmount(enteredAmount);

        if (!amountInYocto) {
          throw new Error("Invalid unlock amount");
        }

        await beginUnlockNear({ amount: amountInYocto });

        setIsCompleted(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to unlock tokens");
      } finally {
        setIsSubmitting(false);
      }
    }, [enteredAmount, beginUnlockNear]);

    const { price, isLoading: isLoadingNearPrice } = usePrice();

    const usdAmount = useMemo(() => {
      if (!price) return "0";
      return Big(nearAmount ?? "0")
        .div(10 ** NEAR_NOMINATION_EXP)
        .mul(price)
        .toFixed(2);
    }, [nearAmount, price]);

    const retryTransaction = useCallback(() => {
      setError(null);
      onSubmit();
    }, [onSubmit]);

    // Success state - "Your voting power is depleted"
    if (isCompleted) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex-1 flex flex-col justify-end items-center gap-6">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-4xl font-bold">
                Your voting power is depleted
              </h2>
              <p className="text-2xl">
                You can always lock more to re-engage with your community
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end items-center gap-4 w-full">
            <UpdatedButton
              type="primary"
              className="w-full"
              onClick={handleViewDashboard}
              variant="rounded"
            >
              View Dashboard
            </UpdatedButton>
          </div>
        </div>
      );
    }

    // Progress state
    if (isSubmitting || isUnlockingNear) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex-1 flex flex-col justify-end items-center gap-6">
            <Image src={UnlockIcon} alt="unlocking" width={300} height={300} />
            <div className="flex flex-col">
              <p className="text-md text-[#9D9FA1] text-center">
                Unlocking tokens...
              </p>
              <div className="text-4xl font-bold text-gray-900 text-center">
                <TokenAmount
                  amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
                  minimumFractionDigits={4}
                  currency="veNEAR"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end w-full items-center gap-4 pb-4">
            <div className="bg-white w-full border border-gray-200 rounded-xl overflow-hidden flex items-center shadow-sm">
              <div className="flex items-center justify-center bg-[#9797FF]/30 gap-3 w-[40px] h-[40px]">
                <InformationCircleIcon className="w-5 h-5 text-[#9797FF]" />
              </div>
              <div className="flex flex-row w-full justify-center items-center gap-2">
                <span className="text-sm font-medium">
                  Pending 1 of 1 wallet signatures
                </span>
                <TooltipWithTap
                  content={
                    <div className="max-w-[300px] flex flex-col text-left p-3">
                      <h4 className="text-lg font-bold mb-2">
                        Unlock Transaction
                      </h4>
                      <p className="text-sm">
                        You need to sign a transaction to initiate the unlock.
                      </p>
                    </div>
                  }
                >
                  <InformationCircleIcon className="w-4 h-4 text-[#9D9FA1]" />
                </TooltipWithTap>
              </div>
            </div>
            <UpdatedButton
              type="secondary"
              className="w-full"
              variant="rounded"
            >
              <div className="flex items-center justify-center w-full">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            </UpdatedButton>
          </div>
        </div>
      );
    }

    // Error state
    if (error || unlockingNearError) {
      return (
        <TransactionError
          message={
            error || unlockingNearError?.message || "Failed to unlock tokens"
          }
          onRetry={retryTransaction}
          onGoBack={handleEdit}
        />
      );
    }

    // Review state
    return (
      <div className="flex flex-col gap-6 w-full h-full">
        <div className="flex justify-start">
          <button
            onClick={handleEdit}
            className="text-sm text-primary font-medium hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-col text-sm border-b border-line gap-4 pb-4">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col">
              <span className="font-bold text-primary">Amount unlocking</span>
            </div>
            <TokenAmount
              amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
              currency="veNEAR"
              className="font-bold"
            />
          </div>
          <div className="flex flex-row justify-between items-start">
            <span className="font-bold text-primary">
              Available to withdraw after
            </span>
            <span className="font-bold text-primary">
              {formattedUnlockDuration}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-[#737373]">Total</div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-gray-900">
              <TokenAmount amount={nearAmount ?? "0"} />
            </div>
            {isLoadingNearPrice ? (
              <Skeleton className="w-16 h-4" />
            ) : (
              <div className="text-sm text-[#9D9FA1]">${usdAmount}</div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end pb-4 gap-4">
          <UnlockWarning />
          <UpdatedButton
            type="primary"
            onClick={onSubmit}
            disabled={!enteredAmount || enteredAmount === "0"}
            className="w-full mt-4"
            variant="rounded"
          >
            Unlock tokens
          </UpdatedButton>
        </div>
      </div>
    );
  }
);

ReviewStep.displayName = "ReviewStep";
