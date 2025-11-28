import { UpdatedButton } from "@/components/Button";
import { Input } from "@/components/ui/input";
import { TooltipWithTap } from "@/components/ui/tooltip-with-tap";
import {
  DEFAULT_GAS_RESERVE,
  NEAR_TOKEN,
  VENEAR_TOKEN_METADATA,
} from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import {
  ChevronDownIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Big from "big.js";
import { utils } from "near-api-js";
import { useCallback, useMemo, useState, useEffect } from "react";
import { AssetIcon } from "../../common/AssetIcon";
import TokenAmount from "../../shared/TokenAmount";
import { useLockProviderContext } from "../LockProvider";
import { useIsPoolWhitelisted } from "@/hooks/useIsPoolWhitelisted";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

type EnterAmountStepProps = {
  openAssetSelector: () => void;
  handleReview: () => void;
};

export const EnterAmountStep = ({
  openAssetSelector,
  handleReview,
}: EnterAmountStepProps) => {
  const {
    enteredAmount,
    onLockMax,
    selectedToken,
    venearAmount,
    lockApy: annualAPY,
    isLoading,
    setEnteredAmount,
    maxAmountToLock,
    amountError,
    isLockingMax,
    lstPriceYocto,
    setCustomStakingPoolId,
    customStakingPoolId,
    lockupAccountId,
    stakingPoolId,
  } = useLockProviderContext();

  const { stakedBalance } = useStakedBalance({
    stakingPoolId,
    accountId: lockupAccountId,
  });

  const [customPoolInput, setCustomPoolInput] = useState(
    customStakingPoolId || ""
  );
  const [isValidatingPool, setIsValidatingPool] = useState(false);
  const [poolError, setPoolError] = useState<string | null>(null);
  const [isPoolValid, setIsPoolValid] = useState(!!customStakingPoolId);
  const [showCustomPool, setShowCustomPool] = useState(!!customStakingPoolId);

  const { isWhitelisted, whitelistAccountId } = useIsPoolWhitelisted();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEnteredAmount(value);
  };
  const onMaxPressed = useCallback(() => {
    onLockMax();
  }, [onLockMax]);

  const formattedVeNearAmount = useMemo(() => {
    return (
      <TokenAmount
        amount={Big(venearAmount ?? "0").lte(0) ? "0" : (venearAmount ?? "0")}
        hideCurrency
        minimumFractionDigits={4}
        className="tabular-nums text-lg"
      />
    );
  }, [venearAmount]);

  const validatePool = useCallback(async () => {
    if (!customPoolInput) {
      setCustomStakingPoolId(undefined);
      setPoolError(null);
      setIsPoolValid(true); // Empty is valid (means no custom pool)
      return;
    }

    setIsValidatingPool(true);
    setPoolError(null);
    setIsPoolValid(false);

    try {
      if (!customPoolInput.endsWith(".near") && !customPoolInput.endsWith(".testnet")) {
        throw new Error("Invalid account ID format");
      }

      if (!customPoolInput.endsWith(".near") && !customPoolInput.endsWith(".testnet")) {
        throw new Error("Invalid account ID format");
      }

      const whitelisted = await isWhitelisted(customPoolInput);
      if (!whitelisted) {
        throw new Error("Pool is not whitelisted");
      }

      setCustomStakingPoolId(customPoolInput);
      setIsPoolValid(true);
      toast.success("Pool validated successfully");
    } catch (err) {
      setPoolError(err instanceof Error ? err.message : "Invalid pool");
      setCustomStakingPoolId(undefined);
      setIsPoolValid(false);
    } finally {
      setIsValidatingPool(false);
    }
  }, [customPoolInput, isWhitelisted, setCustomStakingPoolId]);

  // Reset validation when input changes
  useEffect(() => {
    if (customPoolInput !== customStakingPoolId) {
      setIsPoolValid(false);
      if (!customPoolInput) {
         setIsPoolValid(true);
         setCustomStakingPoolId(undefined);
      }
    }
  }, [customPoolInput, customStakingPoolId, setCustomStakingPoolId]);


  const shouldDisableButton =
    !enteredAmount ||
    Number(enteredAmount) === 0 ||
    isLoading ||
    !!amountError ||
    !isPoolValid ||
    isValidatingPool;

  const showConversion = useMemo(() => {
    return selectedToken?.type === "lst" && !!lstPriceYocto;
  }, [selectedToken?.type, lstPriceYocto]);

  const conversionText = useMemo(() => {
    if (!showConversion) return null;
    const nearPerLst = utils.format.formatNearAmount(lstPriceYocto ?? "0", 4);
    const symbol = selectedToken?.metadata?.symbol ?? "";
    return `1 ${symbol} ≈ ${nearPerLst} NEAR`;
  }, [lstPriceYocto, selectedToken?.metadata?.symbol, showConversion]);
  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <p className="text-2xl font-bold text-left text-primary">
        Lock assets and gain voting power
      </p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center text-sm text-secondary">
          <span>Available to lock</span>
          <TooltipWithTap
            content={
              <div className="max-w-[300px] flex flex-col text-left p-3">
                <h4 className="text-lg font-bold mb-2">Available to lock</h4>
                <p className="text-sm">
                  {`Amount available to lock, with ${utils.format.formatNearAmount(
                    DEFAULT_GAS_RESERVE
                  )} NEAR reserved for gas fees.`}
                </p>
              </div>
            }
          >
            <InformationCircleIcon className="w-4 h-4 ml-1 text-secondary" />
          </TooltipWithTap>
        </div>
        <div>
          <span className="text-3xl font-bold text-primary">
            <TokenAmount
              amount={maxAmountToLock ?? "0"}
              minimumFractionDigits={4}
              currency={selectedToken?.metadata?.symbol}
            />
          </span>
          <div className="h-[16px]">
            <p className="text-sm text-red-500">{amountError}</p>
          </div>
        </div>
      </div>
      <div className="relative flex h-[150px] flex-col border border-line rounded-lg">
        <div className="flex-1 flex">
          <div className="flex flex-row w-full items-center p-4">
            <div className="flex-1">
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
            </div>
            <div className="flex-1 grow flex flex-row max-w-[350px] overflow-hidden">
              <Input
                type="text"
                placeholder="0"
                value={
                  // Override value for display purposes when locking max
                  isLockingMax
                    ? formatNumber(maxAmountToLock ?? "0", NEAR_TOKEN.decimals)
                    : enteredAmount
                }
                onChange={handleAmountChange}
                className="w-full bg-transparent border-none text-lg text-right h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <button
              onClick={onMaxPressed}
              disabled={!maxAmountToLock || Big(maxAmountToLock).lte(0)}
              className="px-3 py-1 text-sm text-[#00E391] hover:bg-[#00E391] hover:text-white rounded transition-colors duration-200"
            >
              Max
            </button>
          </div>
        </div>
        {showConversion && (
          <div className="px-4 pb-2 -mt-2 text-xs text-secondary">
            {conversionText}
          </div>
        )}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 flex items-center justify-center bg-neutral border border-line rounded-full">
            <ArrowDownIcon className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="border-t border-line"></div>
        <div className="flex-1 flex">
          <div className="flex flex-row w-full items-center justify-between p-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md">
              <AssetIcon
                icon={VENEAR_TOKEN_METADATA.icon}
                name={VENEAR_TOKEN_METADATA.name}
              />
              <span className="font-medium text-sm">veNEAR</span>
            </div>
            {formattedVeNearAmount}
          </div>
        </div>
      </div>

      {selectedToken?.type === "near" && (
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowCustomPool((v) => !v)}
                  className="text-sm text-[#9D9FA1] mb-2 flex items-center gap-2 w-fit hover:text-primary transition-colors"
                >
                  <span
                    className={`transition-transform ${
                      showCustomPool ? "rotate-90" : ""
                    }`}
                  >
                    ▸
                  </span>
                  Enter staking pool account ID
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Enter the staking pool account ID you want to use. We
                will verify it against the whitelist.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showCustomPool && (
            <div className="flex flex-col gap-2 pl-4 border-l-2 border-line ml-1">
              {stakingPoolId && (
                <div className="text-[11px] text-[#9D9FA1] mb-1">
                  Current pool:{" "}
                  <span className="font-medium text-gray-700">
                    {stakingPoolId}
                  </span>{" "}
                  · Currently staked:{" "}
                  <span className="font-medium text-gray-700">
                    <TokenAmount amount={stakedBalance ?? "0"} hideCurrency />
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="pool.near"
                    value={customPoolInput}
                    onChange={(e) => setCustomPoolInput(e.target.value)}
                    className={`pr-8 ${
                      poolError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : isPoolValid && customPoolInput
                        ? "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {isPoolValid && customPoolInput && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 absolute right-2 top-1/2 -translate-y-1/2" />
                  )}
                  {poolError && (
                    <XCircleIcon className="w-5 h-5 text-red-500 absolute right-2 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <UpdatedButton
                  onClick={validatePool}
                  disabled={
                    !customPoolInput ||
                    isValidatingPool ||
                    (isPoolValid && customPoolInput === customStakingPoolId)
                  }
                  type="secondary"
                  className="w-[100px]"
                  variant="rounded"
                >
                  {isValidatingPool ? "Checking..." : "Validate"}
                </UpdatedButton>
              </div>
              {poolError && <p className="text-xs text-red-500">{poolError}</p>}

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-[#9D9FA1]">
                  Using whitelist:
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none text-black bg-[#04e391] border-[#04e391] w-fit">
                  {whitelistAccountId || "default from config"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex flex-row justify-between">
          <span className="text-secondary">Voting Power Growth</span>
          <span className="text-primary font-bold">{annualAPY}%</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end pb-4">
        <UpdatedButton
          onClick={handleReview}
          type={shouldDisableButton ? "disabled" : "primary"}
          disabled={shouldDisableButton}
          className="w-full"
          variant="rounded"
        >
          Review
        </UpdatedButton>
      </div>
    </div>
  );
};
