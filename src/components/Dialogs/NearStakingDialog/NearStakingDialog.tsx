import NearTokenAmount from "@/components/shared/NearTokenAmount";
import {
  LINEAR_TOKEN_METADATA,
  NEAR_TOKEN_METADATA,
  STNEAR_TOKEN_METADATA,
} from "@/lib/constants";
import Image from "next/image";
import { useState } from "react";
import { StakingProvider, useStakingProviderContext } from "../StakingProvider";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type NearStakingDialogProps = {
  closeDialog: () => void;
};

const StakingOptionCard = ({
  isSelected,
  onSelect,
  tokenMetadata,
  apy,
  totalVolumeYocto,
}: {
  isSelected: boolean;
  onSelect: () => void;
  tokenMetadata: typeof LINEAR_TOKEN_METADATA;
  apy: number | undefined;
  totalVolumeYocto: string;
}) => {
  return (
    <div
      onClick={onSelect}
      className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-[#00E391] text-black"
          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={tokenMetadata.icon}
            alt={tokenMetadata.symbol}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-medium">{tokenMetadata.symbol}</span>
        </div>

        <div className="text-center">
          <div className="text-sm opacity-70 mb-1">APY</div>
          <div className="text-2xl font-bold">
            {apy ? `${apy.toFixed(2)}%` : "-"}
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-sm opacity-70 mb-1">
          <span>Tot. Vol</span>
        </div>
        <div className="text-sm">
          <NearTokenAmount
            amount={totalVolumeYocto}
            compact={true}
            hideCurrency={true}
            maximumSignificantDigits={2}
          />
        </div>
      </div>
    </div>
  );
};

const StakingDialogContent = ({ closeDialog }: { closeDialog: () => void }) => {
  const {
    liNearStats,
    stNearStats,
    enteredAmount,
    setEnteredAmount,
    onStakeMax,
    maxStakingAmount,
    amountError,
    isLoading,
  } = useStakingProviderContext();

  const [selectedProvider, setSelectedProvider] = useState<"linear" | "stnear">(
    "linear"
  );

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[600px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Stake assets and get liquid rewards
        </h1>
      </div>

      {/* Staking Provider Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StakingOptionCard
          isSelected={selectedProvider === "linear"}
          onSelect={() => setSelectedProvider("linear")}
          tokenMetadata={LINEAR_TOKEN_METADATA}
          apy={liNearStats?.apy}
          totalVolumeYocto={liNearStats?.totalVolumeYocto ?? "-"}
        />
        <StakingOptionCard
          isSelected={selectedProvider === "stnear"}
          onSelect={() => setSelectedProvider("stnear")}
          tokenMetadata={STNEAR_TOKEN_METADATA}
          apy={stNearStats?.apy}
          totalVolumeYocto={stNearStats?.totalVolumeYocto ?? "-"}
        />
      </div>

      {/* Available Balance */}
      <div className="mb-6">
        <div className="text-gray-500 text-sm mb-2">
          NEAR Available{" "}
          <NearTokenAmount amount={maxStakingAmount ?? "0"} hideCurrency />
        </div>

        {/* Amount Input */}
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

            <div className="flex items-center gap-4">
              <button
                onClick={onStakeMax}
                className="px-3 py-1 text-sm text-[#00E391] hover:bg-[#00E391] hover:text-white rounded transition-colors duration-200"
              >
                Max
              </button>
              <Input
                type="text"
                placeholder="0"
                value={enteredAmount}
                onChange={(e) => setEnteredAmount(e.target.value)}
                className="w-full bg-transparent border-none text-lg text-right p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-500 h-2">{amountError}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-4">
        <button
          disabled={!enteredAmount || !!amountError}
          className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-200"
        >
          Continue
        </button>

        <button
          onClick={closeDialog}
          className="w-full text-gray-600 py-2 font-medium hover:text-gray-800 transition-colors duration-200"
        >
          Skip
        </button>
      </div>

      {/* Disclosure */}
      <div className="text-center text-xs text-gray-500">
        You may unstake your tokens at any time.{" "}
        <button className="underline text-black font-medium">
          Disclosures
        </button>
      </div>
    </div>
  );
};

export const NearStakingDialog = ({ closeDialog }: NearStakingDialogProps) => {
  return (
    <StakingProvider>
      <StakingDialogContent closeDialog={closeDialog} />
    </StakingProvider>
  );
};
