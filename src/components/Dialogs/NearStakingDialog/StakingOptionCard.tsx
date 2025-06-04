import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { LINEAR_TOKEN_METADATA } from "@/lib/constants";
import Image from "next/image";

type StakingOptionCardProps = {
  isSelected: boolean;
  onSelect: () => void;
  tokenMetadata: typeof LINEAR_TOKEN_METADATA;
  apy: number | undefined;
  totalVolumeYocto: string;
};

export const StakingOptionCard = ({
  isSelected,
  onSelect,
  tokenMetadata,
  apy,
  totalVolumeYocto,
}: StakingOptionCardProps) => {
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
