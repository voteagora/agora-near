import { UpdatedButton } from "@/components/Button";
import { DEFAULT_GAS_RESERVE } from "@/lib/constants";
import {
  InformationCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import Big from "big.js";
import { utils } from "near-api-js";
import { useMemo } from "react";
import NearTokenAmount from "../../shared/NearTokenAmount";
import { useLockProviderContext } from "../LockProvider";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";

type ReviewStepProps = {
  handleEdit: () => void;
  handleLockMore: () => void;
  handleNext?: () => void;
};

export const ReviewStep = ({
  handleEdit,
  handleLockMore,
  handleNext,
}: ReviewStepProps) => {
  const {
    enteredAmount,
    lockApy: annualAPY,
    isLoading,
    venearAmount,
    depositTotal,
    requiredTransactions,
    selectedToken,
    lockupAccountId,
  } = useLockProviderContext();

  const {
    transactionText,
    transactionStep,
    numTransactions,
    isSubmitting,
    isCompleted,
    executeTransactions,
  } = useTransactionExecution();

  const formattedVeNearAmount = useMemo(() => {
    return (
      <NearTokenAmount
        amount={venearAmount ?? "0"}
        hideCurrency
        minimumFractionDigits={4}
        className="tabular-nums text-lg"
      />
    );
  }, [venearAmount]);

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex-1 flex flex-col justify-end items-center gap-6">
          <LockClosedIcon className="w-16 h-16" />
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
          >
            Lock More Funds
          </UpdatedButton>
          {handleNext && (
            <UpdatedButton type="primary" className="w-full">
              Next
            </UpdatedButton>
          )}
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex-1 flex flex-col justify-end items-center gap-6">
          <LockOpenIcon className="w-16 h-16" />
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
          <UpdatedButton type="secondary" className="w-full">
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
      <div className="flex flex-col gap-3 text-sm border-b border-line pb-4">
        <div className="flex flex-row justify-between items-center">
          <span className="text-secondary">Amount locking</span>
          <span className="text-primary font-medium tabular-nums text-base">
            <NearTokenAmount
              amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
              minimumFractionDigits={4}
              currency={selectedToken?.metadata?.symbol}
            />
          </span>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center text-secondary">
            APY
            <InformationCircleIcon className="w-4 h-4 ml-1 text-secondary" />
          </div>
          <span className="text-primary font-medium tabular-nums text-base">
            {annualAPY}%
          </span>
        </div>
        {Big(depositTotal).gt(0) && (
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center text-secondary">
              Deposit fees
              <InformationCircleIcon className="w-4 h-4 ml-1 text-secondary" />
            </div>
            <span className="text-primary font-medium tabular-nums text-base">
              <NearTokenAmount
                amount={depositTotal ?? "0"}
                minimumFractionDigits={4}
              />
            </span>
          </div>
        )}
        <div className="flex flex-row justify-between items-center">
          <span className="text-secondary">Gas reserve</span>
          <NearTokenAmount
            amount={DEFAULT_GAS_RESERVE}
            className="text-primary font-medium tabular-nums text-base"
          />
        </div>
      </div>

      <div className="flex flex-row justify-between items-center">
        <span className="text-secondary font-medium">Total veNEAR est.</span>
        <span className="text-primary font-bold text-2xl tabular-nums">
          {formattedVeNearAmount}
        </span>
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
          >
            Lock tokens
          </UpdatedButton>
          <p className="text-xs text-secondary text-center text-[#9D9FA1]">
            You may unlock your tokens at any time.{" "}
            <button className="underline text-primary hover:text-primary/80">
              Disclosures
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
