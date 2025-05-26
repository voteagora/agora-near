import { UpdatedButton } from "@/components/Button";
import { Input } from "@/components/ui/input";
import { useNear } from "@/contexts/NearContext";
import { useRefreshStakingPoolBalance } from "@/hooks/useRefreshStakingPoolBalance";
import { useRegisterLockup } from "@/hooks/useRegisterLockup";
import { useSelectStakingPool } from "@/hooks/useSelectStakingPool";
import { NEAR_TOKEN_METADATA } from "@/lib/constants";
import { TokenWithBalance } from "@/lib/types";
import { convertYoctoToTGas, formatNearAccountId } from "@/lib/utils";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import {
  ChevronDownIcon,
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { utils } from "near-api-js";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { AssetIcon } from "../common/AssetIcon";
import NearTokenAmount from "../shared/NearTokenAmount";
import {
  LockProvider,
  LockTransaction,
  useLockProviderContext,
} from "./LockProvider";
import Big from "big.js";
import { useAvailableToLock } from "@/hooks/useAvailableToLock";

type AssetSelectorProps = {
  handleTokenSelect: (token: TokenWithBalance) => void;
};

const AssetSelector = ({ handleTokenSelect }: AssetSelectorProps) => {
  const { availableTokens } = useLockProviderContext();

  return (
    <div className="flex flex-col items-center w-full bg-neutral max-w-[28rem] p-6">
      <div className="flex justify-start w-full mb-6">
        <h2 className="text-2xl font-bold text-primary">Select Asset</h2>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {availableTokens.map((token: TokenWithBalance, index: number) => {
          return (
            <button
              key={index}
              onClick={() => handleTokenSelect(token)}
              className="flex flex-row items-center justify-between w-full p-3 hover:bg-neutral-muted rounded-lg text-left"
            >
              <div className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm shrink-0 relative">
                  {token.metadata?.icon ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={token.metadata.icon}
                        alt={token.metadata.name}
                        width={0}
                        height={0}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ) : (
                    token.metadata?.name.substring(0, 1)
                  )}
                </div>
                <div>
                  <p className="font-medium text-primary">
                    {token.metadata?.symbol}
                  </p>
                  <p className="text-xs text-secondary text-[#676767]">
                    {token.type === "lockup"
                      ? "Lockup Contract"
                      : formatNearAccountId(token.accountId)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <NearTokenAmount
                  amount={token.balance}
                  currency={token.metadata?.symbol}
                  minimumFractionDigits={4}
                  className="text-primary font-medium"
                />
                <p className="text-xs text-secondary tabular-nums text-[#676767]">
                  $600,000.25
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const EnterAmountStep = ({
  openAssetSelector,
  handleReview,
}: {
  openAssetSelector: () => void;
  handleReview: () => void;
}) => {
  const {
    enteredAmount,
    onLockMax,
    availableToLock,
    selectedToken,
    venearAmount,
    lockApy: annualAPY,
    isLoading,
    gasTotal,
    depositTotal,
    setEnteredAmount,
  } = useLockProviderContext();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setEnteredAmount(value);
    }
  };

  const formattedVeNearAmount = useMemo(
    () => (
      <NearTokenAmount
        amount={venearAmount ?? "0"}
        hideCurrency
        minimumFractionDigits={4}
        className="tabular-nums text-lg"
      />
    ),
    [venearAmount]
  );

  return (
    <>
      <div className="flex flex-col gap-6 justify-center min-h-[318px] w-full">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-left text-primary">
            Lock assets and gain voting power
          </p>
          <div className="flex items-center text-sm text-secondary">
            <span>Available to lock</span>
            <InformationCircleIcon className="w-4 h-4 ml-1 text-secondary" />
          </div>
          <span className="text-3xl font-bold text-primary tabular-nums">
            <NearTokenAmount
              amount={availableToLock}
              minimumFractionDigits={4}
            />
          </span>
        </div>

        <div className="relative flex h-[150px] flex-col border border-line rounded-lg">
          <div className="flex-1 flex">
            <div className="flex flex-row w-full items-center p-4 justify-between">
              <button
                onClick={openAssetSelector}
                className="flex flex-row items-center gap-2 bg-[#F2F1EA] px-3 py-1.5 rounded-md hover:bg-opacity-80"
              >
                <AssetIcon
                  icon={selectedToken?.metadata?.icon ?? ""}
                  name={selectedToken?.metadata?.name ?? ""}
                />
                <span className="font-medium text-sm">
                  {selectedToken?.metadata?.symbol ?? "Select Token"}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-primary" />
              </button>
              <div className="flex-1 flex flex-row gap-1 max-w-[150px] items-center">
                <Input
                  type="text"
                  placeholder="0"
                  value={enteredAmount}
                  onChange={handleAmountChange}
                  className="w-full bg-transparent border-none text-lg text-right p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  onClick={onLockMax}
                  className="ml-2 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 rounded"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-8 h-8 flex items-center justify-center bg-neutral border border-line rounded-full">
              <ArrowDownIcon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="border-t border-line"></div>
          <div className="flex-1 flex">
            <div className="flex flex-row w-full items-center justify-between p-4">
              <div className="flex items-center gap-2 bg-[#F2F1EA] px-3 py-1.5 rounded-md">
                <AssetIcon
                  icon={NEAR_TOKEN_METADATA.icon}
                  name={NEAR_TOKEN_METADATA.name}
                />
                <span className="font-medium text-sm">veNEAR</span>
              </div>
              {formattedVeNearAmount}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex flex-row justify-between">
            <span className="text-secondary">APY</span>
            <span className="text-primary font-medium tabular-nums">
              {annualAPY}%
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex items-center text-secondary">
              Deposit fees
              <InformationCircleIcon className="w-4 h-4 ml-1 text-secondary" />
            </div>
            <span className="text-primary font-medium tabular-nums">
              <NearTokenAmount
                amount={depositTotal ?? "0"}
                minimumFractionDigits={4}
              />
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-secondary">Gas est.</span>
            <span className="text-primary font-medium tabular-nums">
              {`${convertYoctoToTGas(gasTotal)} Tgas`}
            </span>
          </div>
        </div>
        <UpdatedButton
          type="primary"
          onClick={handleReview}
          disabled={!enteredAmount || enteredAmount === "0" || isLoading}
          className="w-full"
        >
          Review
        </UpdatedButton>
      </div>
    </>
  );
};

const ReviewStep = ({ handleEdit }: { handleEdit: () => void }) => {
  const {
    lockupAccountId,
    enteredAmount,
    lockApy: annualAPY,
    isLoading,
    venearAmount,
    gasTotal,
    depositTotal,
    requiredTransactions,
    storageDepositAmount,
    lockupDeploymentCost,
    selectedToken,
    lockNear,
    venearAccountInfo,
  } = useLockProviderContext();

  const [transactionText, setTransactionText] = useState<string>("");

  const [transactionStep, setTransactionStep] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { transferNear, transferFungibleToken } = useNear();

  const { registerAndDeployLockupAsync } = useRegisterLockup({});

  const { selectStakingPoolAsync } = useSelectStakingPool({
    lockupAccountId: lockupAccountId ?? "",
  });

  const refreshStakingPoolBalance = useRefreshStakingPoolBalance({
    lockupAccountId: lockupAccountId ?? "",
  });

  const numTransactions = requiredTransactions.length;

  const getTransactionText = useCallback((step: LockTransaction) => {
    switch (step) {
      case "deploy_lockup":
        return "Deploying lockup contract...";
      case "transfer_near":
      case "transfer_ft":
        return "Transferring tokens...";
      case "select_staking_pool":
        return "Selecting staking pool...";
      case "refresh_balance":
        return "Refreshing balance...";
      case "lock_near":
        return "Locking NEAR...";
    }
  }, []);

  const enteredAmountYocto = useMemo(
    () => utils.format.parseNearAmount(enteredAmount) || "0",
    [enteredAmount]
  );

  const { refetchAvailableToLock } = useAvailableToLock({
    lockupAccountId,
    enabled: !!venearAccountInfo,
  });

  const getAmountToTransfer = useCallback(async () => {
    const { data: liquidNearInLockup } = await refetchAvailableToLock();

    if (selectedToken?.type === "near") {
      // Factor in any liquid amount already in the lockup contract
      return new Big(enteredAmountYocto)
        .minus(new Big(liquidNearInLockup ?? "0"))
        .toFixed(0);
    }

    // if (selectedToken?.type === "lst") {
    //   const netNearAmount = new Big(venearAmount ?? "0").minus(
    //     new Big(liquidNearInLockup ?? "0")
    //   );
    //   const netLstAmount = netNearAmount
    //     .div(venearAmount ?? "0")
    //     .mul(enteredAmount);
    //   return netLstAmount.toFixed(0);
    // }

    return enteredAmountYocto;
  }, [enteredAmountYocto, refetchAvailableToLock, selectedToken?.type]);

  const getAmountToLock = useCallback(async () => {
    const { data: liquidNearInLockup } = await refetchAvailableToLock();

    // Case 1: Desired amount is less than your total balance, so only lock the desired amount
    // Case 2: Desired amount is greater than your total balance -- should only happen when you have initially deployed your lockup contract
    // and a marginal amount has already been locked automatically.
    // In either case, locking the min(desired amount, total balance) achieves the desired result.

    const targetLockAmount =
      selectedToken?.type === "lst" ? venearAmount : enteredAmountYocto;

    return new Big(targetLockAmount ?? "0").lt(
      new Big(liquidNearInLockup ?? "0")
    )
      ? targetLockAmount
      : liquidNearInLockup;
  }, [
    enteredAmountYocto,
    refetchAvailableToLock,
    selectedToken?.type,
    venearAmount,
  ]);

  const executeTransaction = useCallback(
    async (transaction: LockTransaction) => {
      switch (transaction) {
        case "deploy_lockup":
          await registerAndDeployLockupAsync(
            storageDepositAmount ?? "",
            lockupDeploymentCost ?? ""
          );
          break;
        case "transfer_ft": {
          const amountToTransfer = await getAmountToTransfer();
          await transferFungibleToken({
            tokenContractId: selectedToken?.accountId ?? "",
            receiverId: lockupAccountId ?? "",
            amount: amountToTransfer,
          });
          break;
        }
        case "transfer_near": {
          const amountToTransfer = await getAmountToTransfer();

          await transferNear({
            receiverId: lockupAccountId ?? "",
            amount: amountToTransfer,
          });
          break;
        }
        case "select_staking_pool":
          await selectStakingPoolAsync({
            stakingPoolId: selectedToken?.accountId ?? "",
          });
          break;
        case "refresh_balance":
          await refreshStakingPoolBalance();
          break;
        case "lock_near": {
          const amountToLock = await getAmountToLock();
          await lockNear({
            amount: amountToLock,
          });
          break;
        }
      }
    },
    [
      getAmountToLock,
      getAmountToTransfer,
      lockNear,
      lockupAccountId,
      lockupDeploymentCost,
      refreshStakingPoolBalance,
      registerAndDeployLockupAsync,
      selectStakingPoolAsync,
      selectedToken?.accountId,
      storageDepositAmount,
      transferFungibleToken,
      transferNear,
    ]
  );

  const executeTransactions = useCallback(async () => {
    try {
      setIsSubmitting(true);
      for (let i = 0; i < requiredTransactions.length; i++) {
        const transaction = requiredTransactions[i];

        setTransactionText(getTransactionText(transaction));
        setTransactionStep(i);

        await executeTransaction(transaction);
      }
    } catch (e) {
      console.error("Transaction failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  }, [requiredTransactions, getTransactionText, executeTransaction]);

  const formattedVeNearAmount = useMemo(
    () => (
      <NearTokenAmount
        amount={venearAmount ?? "0"}
        hideCurrency
        minimumFractionDigits={4}
        className="tabular-nums text-lg"
      />
    ),
    [venearAmount]
  );

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[318px] gap-6">
        {/* Lock Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-neutral border border-line rounded-full">
          <LockClosedIcon className="w-8 h-8 text-primary" />
        </div>

        {/* Current Transaction Text */}
        <p className="text-lg text-primary text-center font-medium">
          {transactionText}
        </p>

        {/* Amount Being Locked */}
        <div className="text-5xl font-bold text-primary tabular-nums">
          <NearTokenAmount
            amount={utils.format.parseNearAmount(enteredAmount) ?? "0"}
            minimumFractionDigits={4}
            hideCurrency={false}
          />
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <InformationCircleIcon className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-800 font-medium">
            Pending {transactionStep + 1} of {numTransactions} wallet signatures
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center w-full py-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 justify-center w-full">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold text-left text-primary">
          Lock assets and gain voting power
        </p>
      </div>

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
        <div className="flex flex-row justify-between items-center">
          <span className="text-secondary">Gas est.</span>
          <span className="text-primary font-medium tabular-nums text-base">
            {`${convertYoctoToTGas(gasTotal)} Tgas`}
          </span>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center">
        <span className="text-secondary font-medium">Total veNEAR est.</span>
        <span className="text-primary font-bold text-2xl tabular-nums">
          {formattedVeNearAmount}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <UpdatedButton
          type="primary"
          onClick={async () => {
            await executeTransactions();
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
  );
};

type NearLockDialogProps = {
  closeDialog: () => void;
};

function NearLockDialogContent() {
  const { setSelectedToken } = useLockProviderContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);

  const handleReview = () => {
    setCurrentStep(2);
  };

  const handleEdit = () => {
    setCurrentStep(1);
  };

  const openAssetSelector = useCallback(() => setIsAssetSelectorOpen(true), []);
  const closeAssetSelector = useCallback(
    () => setIsAssetSelectorOpen(false),
    []
  );

  const handleTokenSelect = useCallback(
    (token: TokenWithBalance) => {
      setSelectedToken(token);
      closeAssetSelector();
    },
    [setSelectedToken, closeAssetSelector]
  );

  if (isAssetSelectorOpen) {
    return <AssetSelector handleTokenSelect={handleTokenSelect} />;
  }

  return (
    <div className="flex flex-col items-center w-full bg-neutral max-w-[28rem] p-6">
      {currentStep === 1 && (
        <EnterAmountStep
          openAssetSelector={openAssetSelector}
          handleReview={handleReview}
        />
      )}
      {currentStep === 2 && <ReviewStep handleEdit={handleEdit} />}
    </div>
  );
}

export const NearLockDialog = (props: NearLockDialogProps) => {
  return (
    <LockProvider onLockSuccess={props.closeDialog}>
      <NearLockDialogContent />
    </LockProvider>
  );
};
