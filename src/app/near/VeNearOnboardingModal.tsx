"use client";

import {
  HouseOfStakeOnboardingProvider,
  useHouseOfStakeOnboardingContext,
} from "@/components/Onboarding/HouseOfStakeOnboardingProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { RadioButton } from "@/components/ui/radio-button";
import { useHouseOfStakeOnboarding } from "@/hooks/useHouseOfStakeOnboarding";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type VeNearOnboardingModalProps = {
  closeDialog: () => void;
};

// Define UI steps that map to the onboarding flow
enum UIStep {
  SELECT_ACCOUNT,
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
    selectedStakingPoolId,
    setSelectedToken,
    setSelectedStakingPoolId,
  } = useHouseOfStakeOnboardingContext();

  const { step: executionStep, executeOnboarding } =
    useHouseOfStakeOnboarding();

  // Determine which UI step to display
  const [uiStep, setUiStep] = useState<UIStep>(UIStep.SELECT_ACCOUNT);

  // Convert staking pool IDs to StakingPool objects with additional info
  const stakingPools: StakingPool[] = stakingPoolIds.map(
    (id) =>
      STAKING_POOL_MAPPING[id] || {
        stakingPoolId: id,
        name: id.split(".")[0],
      }
  );

  // Update UI step when selections change
  useEffect(() => {
    if (selectedToken && !selectedStakingPoolId) {
      setUiStep(UIStep.SELECT_STAKING_POOL);
    } else if (selectedToken && selectedStakingPoolId) {
      setUiStep(UIStep.CONFIRM);
    }
  }, [selectedToken, selectedStakingPoolId]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Render content based on the current UI step
  if (uiStep === UIStep.SELECT_ACCOUNT) {
    return (
      <div className="w-full p-6">
        <h2 className="text-xl font-bold mb-4">Select Token</h2>
        <div className="grid gap-4 mt-6">
          {availableTokens?.map((token) => (
            <div
              key={token.contractId || token.symbol}
              className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedToken?.contractId === token.contractId
                  ? "border-primary bg-gray-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedToken(token)}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-lg">{token.symbol}</span>
                  <span className="text-sm text-gray-500">
                    Balance:{" "}
                    <NearTokenAmount
                      amount={token.balance}
                      currency={token.symbol}
                      maximumSignificantDigits={6}
                    />
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedToken?.contractId === token.contractId
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {selectedToken?.contractId === token.contractId && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
            onClick={() => setUiStep(UIStep.SELECT_ACCOUNT)}
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
                amount={selectedToken?.balance || "0"}
                currency={selectedToken?.symbol || ""}
                maximumSignificantDigits={6}
              />
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
            onClick={() => setUiStep(UIStep.SELECT_STAKING_POOL)}
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
