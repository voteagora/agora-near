import { TokenMetadata } from "@/lib/types";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { memo } from "react";
import { UpdatedButton } from "../Button";

type AssetRowProps = {
  metadata?: TokenMetadata | null;
  columns: {
    title: string;
    subtitle: React.ReactNode;
  }[];
  showOverflowMenu: boolean;
  actionButton?: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
  };
};

export const AssetRow = memo(
  ({ metadata, columns, showOverflowMenu, actionButton }: AssetRowProps) => {
    return (
      <tr className="border-b border-gray-100 last:border-b-0">
        <td className="py-4 pr-16 w-1 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={metadata?.icon ?? ""}
                alt={metadata?.name ?? ""}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {metadata?.symbol}
              </span>
            </div>
          </div>
        </td>

        {columns.map((col) => (
          <td key={col.title} className="py-4 pl-2 pr-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-1">{col.title}</span>
              <span className="font-medium text-gray-900">{col.subtitle}</span>
            </div>
          </td>
        ))}

        <td className="py-4 pl-4 w-1 whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <div className="w-32">
              {actionButton && (
                <UpdatedButton
                  className="w-full"
                  variant="rounded"
                  onClick={
                    actionButton.disabled ? undefined : actionButton.onClick
                  }
                  type={actionButton.disabled ? "disabled" : undefined}
                >
                  {actionButton.title}
                </UpdatedButton>
              )}
            </div>

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
