import { memo, useCallback } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { TokenMetadata } from "@/lib/types";
import NearTokenAmount from "../shared/NearTokenAmount";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";

type AssetRowProps = {
  id: string;
  metadata: TokenMetadata;
  status: "Locked" | "Lockable";
  amount: string;
  showOverflowMenu: boolean;
  buttonType: "Lock & Stake" | "Lock" | null;
};

export const AssetRow = memo(
  ({
    id,
    metadata,
    status,
    amount,
    showOverflowMenu,
    buttonType,
  }: AssetRowProps) => {
    const openDialog = useOpenDialog();

    const handleLockAction = useCallback(() => {
      openDialog({
        type: "NEAR_LOCK",
        params: {
          source: "account_management",
        },
      });
    }, [openDialog]);

    return (
      <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
        {/* Asset Info - Minimum width */}
        <td className="py-4 pr-16 w-1 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={metadata.icon}
                alt={metadata.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {metadata.symbol}
              </span>
            </div>
          </div>
        </td>

        {/* Status Column - Expands to fill remaining space */}
        <td className="py-4 pl-2 pr-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">{status}</span>
            <span className="font-medium text-gray-900">
              <NearTokenAmount
                amount={amount}
                currency={metadata.symbol}
                maximumSignificantDigits={6}
              />
            </span>
          </div>
        </td>

        {/* Actions - Minimum width */}
        <td className="py-4 pl-4 w-1 whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            {/* Action Button - Fixed width for consistency */}
            <div className="w-32">
              {buttonType && (
                <button
                  onClick={handleLockAction}
                  className="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  {buttonType}
                </button>
              )}
            </div>

            {/* Overflow Menu - Always reserve space */}
            <div className="w-9 h-9 flex items-center justify-center">
              {showOverflowMenu && (
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  }
);

AssetRow.displayName = "AssetRow";
