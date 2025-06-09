import LockClosedIcon from "@/assets/icons/lock_closed.svg";
import LockOpenIcon from "@/assets/icons/lock_open.svg";
import { UpdatedButton } from "@/components/Button";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";
import { DEFAULT_GAS_RESERVE } from "@/lib/constants";
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
    } = useTransactionExecution();

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

    if (showDisclosures) {
      return <DisclosuresContent onBack={handleHideDisclosures} />;
    }

    if (isCompleted) {
      // Special UI for LST tokens
      if (selectedToken?.type === "lst") {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex-1 flex flex-col justify-end items-center gap-6">
              {/* Lock icon with sparkles */}
              <div className="relative">
                {/* Sparkles around the lock */}
                <div className="absolute -top-2 -left-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-green-400"
                  >
                    <path
                      d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-3">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-green-400"
                  >
                    <path
                      d="M6 0L7.125 4.875L12 6L7.125 7.125L6 12L4.875 7.125L0 6L4.875 4.875L6 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -left-3">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="text-green-400"
                  >
                    <path
                      d="M5 0L5.938 4.063L10 5L5.938 5.938L5 10L4.063 5.938L0 5L4.063 4.063L5 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-green-400"
                  >
                    <path
                      d="M7 0L8.313 5.688L14 7L8.313 8.313L7 14L5.688 8.313L0 7L5.688 5.688L7 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <Image src={LockClosedIcon} alt="lock" width={40} height={40} />
              </div>

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
            <Image src={LockClosedIcon} alt="coin" width={40} height={40} />
            <div className="flex flex-col">
              <p className="text-md text-[#9D9FA1] text-center">
                {transactionText}
              </p>
              <div className="text-4xl font-bold text-gray-900 tabular-nums text-center">
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
            <Image src={LockOpenIcon} alt="coin" width={40} height={40} />
            <div className="flex flex-col">
              <p className="text-md text-[#9D9FA1] text-center">
                {transactionText}
              </p>
              <div className="text-4xl font-bold text-gray-900 tabular-nums text-center">
                <NearTokenAmount
                  amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
                  minimumFractionDigits={4}
                  currency={selectedToken?.metadata?.symbol}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end w-full items-center gap-4 pb-4">
            <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg w-full">
              <div className="flex flex-row items-center gap-2">
                <div className="h-full flex grow">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100">
                    <InformationCircleIcon className="text-purple-600" />
                  </div>
                </div>
                <div className="flex text-sm py-2 text-gray-900 font-medium">
                  Pending {transactionStep + 1} of {numTransactions} wallet
                  signatures
                </div>
              </div>
              <div className="px-2">
                <InformationCircleIcon className="w-4 h-4 text-gray-400" />
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
          <div className="border-t border-gray-200"></div>
          <div className="flex flex-row justify-between items-center py-4">
            <span className="font-bold text-primary">Gas reserve</span>
            <NearTokenAmount
              amount={DEFAULT_GAS_RESERVE}
              className="font-bold"
            />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span>Total est. veNEAR</span>
          {formattedVeNearAmount}
        </div>

        <div className="flex-1 flex flex-col justify-end pb-4">
          <div className="flex flex-col gap-2">
            <UpdatedButton
              type="primary"
              onClick={async () => {
                await executeTransactions({
                  numTransactions: requiredTransactions.length,
                });
              }}
              disabled={
                !enteredAmount ||
                enteredAmount === "0" ||
                !lockupAccountId ||
                isLoading
              }
              className="w-full mt-4"
              variant="rounded"
            >
              {error ? "Failed to lock - try again" : "Lock tokens"}
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
