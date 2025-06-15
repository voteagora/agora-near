import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { LINEAR_TOKEN_METADATA } from "@/lib/constants";
import Image from "next/image";

type StakingOptionCardProps = {
  isSelected: boolean;
  onSelect: () => void;
  tokenMetadata: typeof LINEAR_TOKEN_METADATA;
  apy: number | undefined;
  totalVolumeYocto: string;
  isEnabled?: boolean;
};

export const StakingOptionCard = ({
  isSelected,
  onSelect,
  tokenMetadata,
  apy,
  totalVolumeYocto,
  isEnabled = true,
}: StakingOptionCardProps) => {
  return (
    <div
      onClick={isEnabled ? onSelect : undefined}
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
            className="rounded-full border border-black bg-white"
          />
          <span className="font-medium">{tokenMetadata.name}</span>
        </div>

        <div className="text-center">
          <div className="text-xs mb-1 text-[#676767]">EST. APY</div>
          <div className="text-4xl font-light">
            {apy ? `${apy.toFixed(2)}%` : "-"}
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-xs text-[#676767] mb-1">
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
