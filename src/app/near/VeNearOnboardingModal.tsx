"use client";

import {
  HouseOfStakeOnboardingProvider,
  LINEAR_TOKEN_CONTRACT_ID,
  STNEAR_TOKEN_CONTRACT_ID,
  useHouseOfStakeOnboardingContext,
} from "@/components/Onboarding/HouseOfStakeOnboardingProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { RadioButton } from "@/components/ui/radio-button";
import { useHouseOfStakeOnboarding } from "@/hooks/useHouseOfStakeOnboarding";
import { utils } from "near-api-js";
import { useEffect, useState, useRef, useMemo } from "react";
import { toast } from "react-hot-toast";
import Big from "big.js";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
type VeNearOnboardingModalProps = {
  closeDialog: () => void;
};

// Define UI steps that map to the onboarding flow
enum UIStep {
  ENTER_AMOUNT,
  SELECT_STAKING_POOL,
  CONFIRM,
  EXECUTING,
  COMPLETED,
}

// Define type for staking pool
type StakingPool = {
  stakingPoolId: string;
  name: string;
  description?: string;
};

// Mapping of contract IDs to human-readable names
const STAKING_POOL_MAPPING: Record<string, StakingPool> = {
  "linear-protocol.testnet": {
    stakingPoolId: "linear-protocol.testnet",
    name: "liNEAR",
    description: "5.99% APY",
  },
  "meta-v2.pool.testnet": {
    stakingPoolId: "meta-v2.pool.testnet",
    name: "MetaPool",
    description: "5.98% APY",
  },
};

export const VeNearOnboardingModalContent = ({
  closeDialog,
}: {
  closeDialog: () => void;
}) => {
  const {
    isLoading,
    availableTokens,
    stakingPools: stakingPoolIds,
    selectedToken,
    setSelectedToken,
    setPreferredStakingPoolId: setSelectedStakingPoolId,
    enteredAmount,
    setEnteredAmount,
    stNearPrice,
    liNearPrice,
    preferredStakingPoolId: selectedStakingPoolId,
  } = useHouseOfStakeOnboardingContext();

  const { step: executionStep, executeOnboarding } =
    useHouseOfStakeOnboarding();
  const [uiStep, setUiStep] = useState<UIStep>(UIStep.ENTER_AMOUNT);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const tokenDropdownRef = useRef<HTMLDivElement>(null);

  // Select the first token by default
  useEffect(() => {
    if (!selectedToken && availableTokens.length > 0) {
      setSelectedToken(availableTokens[0]);
    }
  }, [selectedToken, availableTokens, setSelectedToken]);

  // Convert staking pool IDs to StakingPool objects with additional info
  const stakingPools: StakingPool[] = stakingPoolIds.map(
    (id) =>
      STAKING_POOL_MAPPING[id] || {
        stakingPoolId: id,
        name: id.split(".")[0],
      }
  );

  // Handle onboarding execution
  const handleExecuteOnboarding = async () => {
    try {
      setUiStep(UIStep.EXECUTING);
      await executeOnboarding();
      setUiStep(UIStep.COMPLETED);
      toast.success("Onboarding completed successfully!");
      closeDialog();
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error("Failed to complete onboarding. Please try again.");
      setUiStep(UIStep.CONFIRM);
    }
  };

  // Handle amount and token selection
  const handleContinueFromAmountStep = () => {
    if (!selectedToken || !enteredAmount || parseFloat(enteredAmount) <= 0) {
      toast.error("Please enter a valid amount and select a token");
      return;
    }
    if (selectedToken.type === "lst") {
      setSelectedStakingPoolId(selectedToken.contractId ?? "");
      setUiStep(UIStep.CONFIRM);
    } else {
      setUiStep(UIStep.SELECT_STAKING_POOL);
    }
  };

  const estimatedVeNear = useMemo(() => {
    if (!enteredAmount || !selectedToken) return "0";

    try {
      if (selectedToken.type === "near") {
        return utils.format.parseNearAmount(enteredAmount) || "0";
      } else if (
        selectedToken.contractId === STNEAR_TOKEN_CONTRACT_ID &&
        stNearPrice
      ) {
        // Convert stNEAR to NEAR using the rate
        const valueInNear = new Big(enteredAmount).times(stNearPrice);
        return valueInNear.toFixed(0);
      } else if (
        selectedToken.contractId === LINEAR_TOKEN_CONTRACT_ID &&
        liNearPrice
      ) {
        // Convert liNEAR to NEAR using the rate
        const valueInNear = new Big(enteredAmount).times(liNearPrice);
        return valueInNear.toFixed(0);
      }
    } catch (e) {
      console.error("Error calculating estimated veNEAR:", e);
    }

    return "0";
  }, [enteredAmount, liNearPrice, selectedToken, stNearPrice]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Render content based on the current UI step
  if (uiStep === UIStep.ENTER_AMOUNT) {
    return (
      <div className="w-full p-6">
        <h2 className="text-xl font-bold mb-4">Enter lock amount</h2>
        <div className="mb-8">
          <div className="p-5 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <input
                type="number"
                value={enteredAmount}
                onChange={(e) => setEnteredAmount(e.target.value)}
                placeholder="0"
                className="w-full text-4xl bg-transparent border-none focus:outline-none focus:ring-0"
                min="0"
                step="0.01"
              />
            </div>
            {/* Lock with row */}
            <div
              className="flex items-center justify-between py-3 border-t border-gray-200 cursor-pointer"
              onClick={() => setShowTokenDropdown((v) => !v)}
            >
              <div className="flex items-center">
                <span className="font-medium">Selected token</span>
              </div>
              <div className="flex flex-row items-center">
                {selectedToken ? (
                  <NearTokenAmount
                    amount={selectedToken.balance}
                    currency={selectedToken.symbol}
                  />
                ) : null}
                {showTokenDropdown ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </div>
            </div>
            {/* Dropdown for token selection */}
            {showTokenDropdown && (
              <div
                ref={tokenDropdownRef}
                className="absolute z-10 bg-white border rounded-lg shadow-lg mt-2 w-72"
              >
                {availableTokens.map((token) => (
                  <div
                    key={token.contractId || token.symbol}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 ${selectedToken?.contractId === token.contractId && selectedToken?.symbol === token.symbol ? "bg-gray-50" : ""}`}
                    onClick={() => {
                      setSelectedToken(token);
                      setShowTokenDropdown(false);
                    }}
                  >
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-sm">
                      <NearTokenAmount
                        amount={token.balance}
                        currency={token.symbol}
                      />
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Receive veNEAR row */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200 mt-2">
              <div className="flex items-center">
                <span className="font-medium">Receive</span>
              </div>
              <span className="text-lg">
                <NearTokenAmount
                  amount={estimatedVeNear}
                  currency="veNEAR"
                  maximumSignificantDigits={2}
                />
                {selectedToken?.type === "lst" && <span>{` (est.)`}</span>}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span>Lockup APY</span>
            <span className="text-green-500 font-medium">5.99%</span>
          </div>
        </div>
        <button
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            !selectedToken || !enteredAmount || parseFloat(enteredAmount) <= 0
          }
          onClick={handleContinueFromAmountStep}
        >
          Continue
        </button>
      </div>
    );
  }

  if (uiStep === UIStep.SELECT_STAKING_POOL) {
    return (
      <div className="w-full p-6">
        <h2 className="text-xl font-bold mb-4">Select Staking Pool</h2>
        <p className="text-gray-500 mb-6">
          Choose a staking pool provider for your NEAR tokens
        </p>
        <div className="space-y-4 mt-6">
          {stakingPools.map((pool: StakingPool) => (
            <div
              key={pool.stakingPoolId}
              className={`p-4 border rounded-lg ${
                selectedStakingPoolId === pool.stakingPoolId
                  ? "border-primary"
                  : "border-gray-200"
              }`}
            >
              <RadioButton
                title={pool.name}
                checked={selectedStakingPoolId === pool.stakingPoolId}
                onClick={() => setSelectedStakingPoolId(pool.stakingPoolId)}
              />
              {pool.description && (
                <p className="text-sm text-green-500 mt-1 ml-1">
                  {pool.description}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg mr-3"
            onClick={() => setUiStep(UIStep.ENTER_AMOUNT)}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            disabled={!selectedStakingPoolId}
            onClick={() => setUiStep(UIStep.CONFIRM)}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (uiStep === UIStep.CONFIRM) {
    const selectedPool = stakingPools.find(
      (p) => p.stakingPoolId === selectedStakingPoolId
    );
    return (
      <div className="w-full p-6">
        <h2 className="text-xl font-bold mb-4">Confirm Your Selections</h2>
        <div className="bg-gray-50 p-5 rounded-lg mb-6 mt-4">
          <div className="mb-4">
            <span className="text-sm text-primary">You are about to lock</span>
            <div className="font-medium text-lg">
              <NearTokenAmount
                amount={utils.format.parseNearAmount(enteredAmount) || "0"}
                currency={selectedToken?.symbol || ""}
                maximumSignificantDigits={6}
              />
            </div>
          </div>
          <div className="mb-4">
            <span className="text-sm text-primary">You will receive</span>
            <div className="font-medium text-lg">
              <NearTokenAmount amount={estimatedVeNear} currency="veNEAR" />
            </div>
          </div>
          <div>
            <span className="text-sm text-primary">You are staking with</span>
            <div className="font-medium">
              {selectedPool?.name || selectedStakingPoolId}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg"
            onClick={() =>
              selectedToken?.type === "lst"
                ? setUiStep(UIStep.ENTER_AMOUNT)
                : setUiStep(UIStep.SELECT_STAKING_POOL)
            }
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            onClick={handleExecuteOnboarding}
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    );
  }

  if (uiStep === UIStep.EXECUTING) {
    return (
      <div className="w-full p-6">
        <h2 className="text-xl font-bold mb-4">Processing</h2>
        <div className="flex flex-col items-center p-6">
          <LoadingSpinner />
          <p className="mt-4 text-center font-medium">
            {executionStep === 0 && "Deploying lockup contract..."}
            {executionStep === 1 && "Selecting staking pool..."}
            {executionStep === 2 && "Transferring funds..."}
            {executionStep === 3 && "Locking NEAR..."}
            {executionStep === 4 && "Staking NEAR..."}
            {executionStep === 5 && "Finalizing..."}
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Please wait while we process your transaction
          </p>
        </div>
      </div>
    );
  }

  return <></>;
};

export function VeNearOnboardingModal({
  closeDialog,
}: VeNearOnboardingModalProps) {
  return (
    <HouseOfStakeOnboardingProvider>
      <VeNearOnboardingModalContent closeDialog={closeDialog} />
    </HouseOfStakeOnboardingProvider>
  );
}
