import { UpdatedButton } from "@/components/Button";
import TokenAmount from "@/components/shared/TokenAmount";
import { Input } from "@/components/ui/input";
import { NEAR_TOKEN, NEAR_TOKEN_METADATA } from "@/lib/constants";
import { StakingPool } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Big from "big.js";
import Image from "next/image";
import { useCallback, useState, useMemo } from "react";
import { useStakingProviderContext } from "../StakingProvider";
import { StakingDialogHeader } from "./StakingDialogHeader";
import { StakingOptionCard } from "./StakingOptionCard";
import { useIsPoolWhitelisted } from "@/hooks/useIsPoolWhitelisted";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useStakedBalance } from "@/hooks/useStakedBalance";

type EnterStakingAmountProps = {
  onContinue: (selectedProvider: StakingPool) => void;
  onSkip: () => void;
};

export const EnterStakingAmount = ({
  onContinue,
  onSkip,
}: EnterStakingAmountProps) => {
  const {
    poolStats,
    pools,
    enteredAmount,
    setEnteredAmount,
    onStakeMax,
    maxStakingAmount,
    amountError,
    selectedPool,
    setSelectedPool,
    source,
    hasAlreadySelectedStakingPool,
    isStakingMax,
    customStakingPoolId: prefilledCustomPoolId,
    totalAvailableToStake,
  } = useStakingProviderContext();

  const [customPoolId, setCustomPoolId] = useState<string>(
    prefilledCustomPoolId ?? ""
  );
  const [whitelistContractId, setWhitelistContractId] = useState<string>("");
  const { isWhitelisted, whitelistAccountId } = useIsPoolWhitelisted(
    whitelistContractId || undefined
  );
  const [isValidatingCustomPool, setIsValidatingCustomPool] =
    useState<boolean>(false);
  const [customPoolError, setCustomPoolError] = useState<string>("");

  // Lockup and current staking pool context to show current staked balance
  const { lockupAccountId } = useLockupAccount();
  const { stakingPoolId: currentPoolId } = useCurrentStakingPoolId({
    lockupAccountId: lockupAccountId ?? "",
    enabled: !!lockupAccountId,
  });
  const { stakedBalance } = useStakedBalance({
    stakingPoolId: currentPoolId,
    accountId: lockupAccountId,
  });

  // Basic NEAR account ID format validation
  const isValidNearAccountId = (id: string) => {
    if (!/^[a-z0-9._-]{2,64}$/.test(id)) return false;
    if (id.startsWith(".") || id.endsWith(".")) return false;
    return id
      .split(".")
      .every((part) => part.length >= 2 && /^[a-z0-9_-]+$/.test(part));
  };
  const isCustomPoolSelected = useMemo(() => {
    return !pools.some((p) => p.id === selectedPool.id);
  }, [pools, selectedPool]);

  const [showCustomPool, setShowCustomPool] = useState<boolean>(
    !!prefilledCustomPoolId || isCustomPoolSelected
  );

  const isCustomPoolValid = useMemo(() => {
    if (!customPoolId) return false;
    return isValidNearAccountId(customPoolId);
  }, [customPoolId]);

  const handleUseCustomPool = useCallback(async () => {
    console.log("[EnterStakingAmount] Use custom pool clicked", {
      customPoolId,
      isCustomPoolValid,
    });

    // Format validation for pool and optional whitelist override
    if (!isCustomPoolValid) {
      setCustomPoolError("Enter a valid NEAR account ID for the staking pool.");
      toast.error("Invalid pool account ID format.");
      return;
    }
    if (whitelistContractId && !isValidNearAccountId(whitelistContractId)) {
      setCustomPoolError("Invalid whitelist account ID format.");
      toast.error("Invalid whitelist account ID format.");
      return;
    }

    setCustomPoolError("");
    setIsValidatingCustomPool(true);
    try {
      console.log("[EnterStakingAmount] Validating whitelist for pool", {
        customPoolId,
      });
      const allowed = await isWhitelisted(customPoolId);
      console.log("[EnterStakingAmount] Whitelist result", {
        customPoolId,
        allowed,
      });
      if (!allowed) {
        setCustomPoolError("Pool is not whitelisted for House of Stake.");
        toast.error("Pool is not whitelisted for House of Stake.");
        return;
      }
      console.log("[EnterStakingAmount] Setting selected pool", {
        id: customPoolId,
      });
      setSelectedPool({
        id: customPoolId,
        contract: customPoolId,
        metadata: NEAR_TOKEN_METADATA,
      } as StakingPool);
      toast.success(
        `Selected pool: ${customPoolId}. Continue to Stake to apply this pool.`
      );
      setCustomPoolId(""); // Clear input after successful selection
    } finally {
      setIsValidatingCustomPool(false);
      console.log("[EnterStakingAmount] Finished custom pool validation");
    }
  }, [
    customPoolId,
    isCustomPoolValid,
    whitelistContractId,
    isValidNearAccountId,
    isWhitelisted,
    setSelectedPool,
  ]);

  const handleContinue = useCallback(() => {
    console.log("[EnterStakingAmount] Continue clicked", {
      enteredAmount,
      amountError,
      selectedPool,
    });
    if (!enteredAmount || !!amountError) return;
    onContinue(selectedPool);
  }, [enteredAmount, amountError, onContinue, selectedPool]);

  return (
    <div className="flex-1 flex flex-col gap-2">
      <StakingDialogHeader />
      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Stake assets and get liquid rewards
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {pools.map((pool) => (
            <StakingOptionCard
              key={pool.id}
              isEnabled={!hasAlreadySelectedStakingPool}
              isSelected={selectedPool.id === pool.id}
              onSelect={() => setSelectedPool(pool)}
              tokenMetadata={pool.metadata}
              apy={poolStats[pool.id]?.apy}
              totalVolumeYocto={poolStats[pool.id]?.totalVolumeYocto ?? "-"}
            />
          ))}
        </div>
        {/* Custom pool entry - collapsed by default */}
        <div className="mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowCustomPool((v) => !v)}
                  className="text-sm text-[#9D9FA1] mb-2 flex items-center gap-2"
                >
                  <span
                    className={`transition-transform ${showCustomPool ? "rotate-90" : ""}`}
                  >
                    ▸
                  </span>
                  {hasAlreadySelectedStakingPool
                    ? "Change to a custom staking pool"
                    : "Enter a custom staking pool"}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Enter or change the staking pool account ID you want to use. We
                will verify it against the selected whitelist.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {showCustomPool && (
            <>
              <div className="flex flex-col gap-2">
                {/* Selected pool badge and current staked summary */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] text-[#9D9FA1]">Selected:</span>
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none text-black bg-gray-100 border-gray-200 w-fit">
                    {selectedPool?.contract}
                  </span>
                </div>
                {currentPoolId && (
                  <div className="text-[11px] text-[#9D9FA1]">
                    Current pool:{" "}
                    <span className="font-medium text-gray-700">
                      {currentPoolId}
                    </span>{" "}
                    · Currently staked:{" "}
                    <span className="font-medium text-gray-700">
                      <TokenAmount amount={stakedBalance ?? "0"} hideCurrency />
                    </span>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="staking-pool.account.near"
                    value={customPoolId}
                    onChange={(e) => setCustomPoolId(e.target.value.trim())}
                  />
                  <UpdatedButton
                    variant="rounded"
                    onClick={handleUseCustomPool}
                    disabled={
                      !isCustomPoolValid ||
                      isValidatingCustomPool ||
                      (whitelistContractId &&
                        !isValidNearAccountId(whitelistContractId))
                    }
                  >
                    {isValidatingCustomPool ? "Checking..." : "Use"}
                  </UpdatedButton>
                </div>
                {/* Inline format validation for pool */}
                {customPoolId && !isValidNearAccountId(customPoolId) && (
                  <div className="text-xs text-red-500">
                    Invalid pool account ID format
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#9D9FA1] flex items-center gap-1">
                    Whitelist contract (optional)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center justify-center rounded-full p-1 hover:bg-muted">
                            <Info className="h-3.5 w-3.5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Supply a whitelist contract if your custom pool
                          belongs to a legacy factory. We will validate the pool
                          against this whitelist.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="text"
                    placeholder="whitelist.factory.near"
                    value={whitelistContractId}
                    onChange={(e) =>
                      setWhitelistContractId(e.target.value.trim())
                    }
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-[#9D9FA1]">
                      Using whitelist:
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none text-black bg-[#04e391] border-[#04e391] w-fit">
                      {whitelistAccountId || "default from config"}
                    </span>
                  </div>
                  {/* Inline format validation for whitelist */}
                  {whitelistContractId &&
                    !isValidNearAccountId(whitelistContractId) && (
                      <div className="text-[11px] text-red-500">
                        Invalid whitelist account ID format
                      </div>
                    )}
                </div>
              </div>
              {!!customPoolError && (
                <div className="text-xs text-red-500 mt-1">
                  {customPoolError}
                </div>
              )}
            </>
          )}
        </div>
        <div className="mb-6">
          <div className="text-base text-[#9D9FA1] mb-2">
            NEAR Available{" "}
            <TokenAmount amount={totalAvailableToStake ?? "0"} hideCurrency />
          </div>

          {(!totalAvailableToStake || Big(totalAvailableToStake).lte(0)) && (
            <div className="mb-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-[#9D9FA1]">
                  No NEAR available to stake. To stake, lock more NEAR or
                  deposit additional funds into your lockup.
                </p>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Image
                  src={NEAR_TOKEN_METADATA.icon}
                  alt="NEAR"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">NEAR</span>
              </div>

              <div className="flex items-center ml-2">
                <Input
                  type="text"
                  placeholder="0"
                  value={
                    // Override value for display purposes when staking max
                    isStakingMax
                      ? formatNumber(
                          totalAvailableToStake ?? "0",
                          NEAR_TOKEN.decimals
                        )
                      : enteredAmount
                  }
                  onChange={(e) => setEnteredAmount(e.target.value)}
                  className="w-full bg-transparent border-none text-lg text-right h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  onClick={onStakeMax}
                  disabled={!totalAvailableToStake || Big(totalAvailableToStake).lte(0)}
                  className="px-3 py-1 text-sm text-[#00E391] hover:bg-[#00E391] hover:text-white rounded transition-colors duration-200"
                >
                  Max
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-red-500 h-2">{amountError}</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end gap-2 mb-4">
          <UpdatedButton
            onClick={handleContinue}
            disabled={!enteredAmount || !!amountError}
            variant="rounded"
          >
            Continue
          </UpdatedButton>

          {source === "onboarding" && <button onClick={onSkip}>Skip</button>}
        </div>
      </div>
    </div>
  );
};
