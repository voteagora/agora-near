import {
  default as LockClosedIcon,
  default as LockedIcon,
} from "@/assets/icons/Locked.png";
import LockOpenIcon from "@/assets/icons/Locking.png";
import { UpdatedButton } from "@/components/Button";
import { TransactionError } from "@/components/TransactionError";
import { TooltipWithTap } from "@/components/ui/tooltip-with-tap";
import { useDeployLockupAndLock } from "@/hooks/useDeployLockupAndLock";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Big from "big.js";
import { utils } from "near-api-js";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import NearTokenAmount from "../../shared/NearTokenAmount";
import { useLockProviderContext } from "../LockProvider";
import { DepositTooltip } from "./DepositTooltip";
import { DisclosuresContent } from "./DisclosuresContent";

type ReviewStepProps = {
  handleEdit: () => void;
  handleLockMore: () => void;
  handleProceedToStaking: () => void;
  handleViewDashboard: () => void;
};

export const ReviewStep = memo(
  ({
    handleEdit,
    handleLockMore,
    handleProceedToStaking,
    handleViewDashboard,
  }: ReviewStepProps) => {
    const [showDisclosures, setShowDisclosures] = useState(false);

    const {
      enteredAmount,
      lockApy: annualAPY,
      isLoading,
      venearAmount,
      depositTotal,
      requiredTransactions,
      selectedToken,
      lockupAccountId,
      venearStorageCost,
      lockupStorageCost,
    } = useLockProviderContext();

    const {
      transactionText,
      transactionStep,
      numTransactions,
      isSubmitting,
      isCompleted,
      executeTransactions,
      error,
      retryFromCurrentStep,
    } = useDeployLockupAndLock();

    const handleShowDisclosures = useCallback(() => {
      setShowDisclosures(true);
    }, []);

    const handleHideDisclosures = useCallback(() => {
      setShowDisclosures(false);
    }, []);

    const formattedVeNearAmount = useMemo(() => {
      return (
        <NearTokenAmount
          amount={venearAmount ?? "0"}
          hideCurrency
          minimumFractionDigits={4}
          className="font-bold text-lg"
        />
      );
    }, [venearAmount]);

    const onSubmit = useCallback(() => {
      executeTransactions({
        numTransactions: requiredTransactions.length,
      });
    }, [executeTransactions, requiredTransactions.length]);

    if (showDisclosures) {
      return <DisclosuresContent onBack={handleHideDisclosures} />;
    }

    if (isCompleted) {
      // Special UI for LST tokens
      if (selectedToken?.type === "lst") {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex-1 flex flex-col justify-end items-center gap-6">
              <Image src={LockedIcon} alt="locked" width={300} />
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Locked, and loaded.
                </h2>
                <p className="text-base text-gray-600 max-w-sm">
                  Your rewards are flowing and your vote just got stronger!
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end items-center gap-4 w-full">
              <UpdatedButton
                onClick={handleLockMore}
                type="secondary"
                className="w-full"
                variant="rounded"
              >
                Lock More Funds
              </UpdatedButton>
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

      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex-1 flex flex-col justify-end items-center gap-6">
            <Image src={LockClosedIcon} alt="coin" width={300} />
            <div className="flex flex-col">
              <p className="text-md text-[#9D9FA1] text-center">
                {transactionText}
              </p>
              <div className="text-4xl font-bold text-gray-900 text-center">
                <NearTokenAmount
                  amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
                  minimumFractionDigits={4}
                  currency={selectedToken?.metadata?.symbol}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end items-center gap-4 w-full">
            <UpdatedButton
              onClick={handleLockMore}
              type="secondary"
              className="w-full"
              variant="rounded"
            >
              Lock More Funds
            </UpdatedButton>
            <UpdatedButton
              type="primary"
              className="w-full"
              onClick={handleProceedToStaking}
              variant="rounded"
            >
              Next
            </UpdatedButton>
          </div>
        </div>
      );
    }

    if (isSubmitting) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex-1 flex flex-col justify-end items-center gap-6">
            <Image src={LockOpenIcon} alt="coin" width={300} height={300} />
            <div className="flex flex-col">
              <p className="text-md text-[#9D9FA1] text-center">
                {transactionText}
              </p>
              <div className="text-4xl font-bold text-gray-900 text-center">
                <NearTokenAmount
                  amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
                  minimumFractionDigits={4}
                  currency={selectedToken?.metadata?.symbol}
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
                  Pending {transactionStep + 1} of {numTransactions} wallet
                  signatures
                </span>
                <TooltipWithTap
                  content={
                    <div className="max-w-[300px] flex flex-col text-left p-3">
                      <h4 className="text-lg font-bold mb-2">
                        You&apos;ll need to complete a few wallet signatures to
                        complete setup.
                      </h4>
                      <p className="text-sm">
                        Depending on what you&apos;re locking, this may include:
                      </p>
                      <div className="border-b border-gray-200 my-2" />
                      <ul className="text-md space-y-1 font-bold list-disc pl-4">
                        <li>Deploying your lockup contract (one-time)</li>
                        <li>Transferring tokens</li>
                        <li>Locking your assets</li>
                      </ul>
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

    if (error) {
      return (
        <TransactionError
          message={error}
          onRetry={retryFromCurrentStep}
          onGoBack={handleEdit}
        />
      );
    }

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
        <div className="flex flex-col text-sm border-b border-line">
          <div className="flex flex-row justify-between items-start py-4">
            <div className="flex flex-col">
              <span className="font-bold text-primary">Amount locking</span>
              <span className="text-secondary text-xs">{annualAPY}% APY</span>
            </div>
            <NearTokenAmount
              amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
              minimumFractionDigits={4}
              currency={selectedToken?.metadata?.symbol}
              className="font-bold"
            />
          </div>
          {Big(depositTotal).gt(0) && (
            <>
              <div className="border-t border-gray-200"></div>
              <div className="flex flex-row justify-between items-center py-4">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-primary">Deposit fees</span>
                  <DepositTooltip
                    totalDeposit={depositTotal}
                    title="Voting Requirements"
                    subtitle="To participate in voting you'll need to make two deposits:"
                    lineItems={[
                      {
                        amount: venearStorageCost,
                        title: "Account Deposit",
                        description:
                          "This covers your account storage in the veNEAR contract. This amount is locked immediately and cannot be withdrawn.",
                      },
                      {
                        amount: lockupStorageCost,
                        title: "Lockup Deposit",
                        description:
                          "This covers your lockup contract's deployment and storage costs. This is refundable, and can be locked but cannot be staked.",
                      },
                    ]}
                  />
                </div>
                <NearTokenAmount
                  amount={depositTotal ?? "0"}
                  minimumFractionDigits={4}
                  className="font-bold"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span>Total est. veNEAR</span>
          {formattedVeNearAmount}
        </div>

        <div className="flex-1 flex flex-col justify-end pb-4">
          <div className="flex flex-col gap-2">
            <UpdatedButton
              type="primary"
              onClick={onSubmit}
              disabled={
                !enteredAmount ||
                enteredAmount === "0" ||
                !lockupAccountId ||
                isLoading
              }
              className="w-full mt-4"
              variant="rounded"
            >
              Lock tokens
            </UpdatedButton>
            <p className="text-xs text-secondary text-center text-[#9D9FA1]">
              You may unlock your tokens at any time.{" "}
              <button
                className="underline text-primary hover:text-primary/80"
                onClick={handleShowDisclosures}
              >
                Disclosures
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ReviewStep.displayName = "ReviewStep";
