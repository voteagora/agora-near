import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TokenMetadata } from "@/lib/types";
import {
  ArrowTopRightOnSquareIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { memo, useMemo } from "react";
import { UpdatedButton } from "../Button";
import LoadingSpinner from "../shared/LoadingSpinner";

type OverflowButton = {
  title: string;
  onClick: () => void;
  showExternalIcon?: boolean;
};

type AssetRowProps = {
  metadata?: TokenMetadata | null;
  columns: {
    title: React.ReactNode;
    subtitle: React.ReactNode;
  }[];
  showOverflowMenu: boolean;
  overflowButtons?: OverflowButton[];
  actionButton?: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  };
  className?: string;
};

const MAX_COLUMNS = 4;

export const AssetRow = memo(
  ({
    metadata,
    columns,
    showOverflowMenu,
    overflowButtons,
    actionButton,
    className,
  }: AssetRowProps) => {
    const numColPlaceholders = MAX_COLUMNS - columns.length - 1;

    if (numColPlaceholders < 0) {
      throw new Error("Columns length is greater than maximum columns");
    }

    const columnPlaceholders = Array.from(
      { length: numColPlaceholders },
      (_, index) => (
        <td key={index} className="py-4 pl-2 pr-4">
          <></>
        </td>
      )
    );

    const actionButtonContent = useMemo(() => {
      if (!actionButton) return null;

      return (
        <UpdatedButton
          className="w-full"
          variant="rounded"
          onClick={actionButton.disabled ? undefined : actionButton.onClick}
          type={actionButton.disabled ? "disabled" : undefined}
        >
          {actionButton.isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            actionButton.title
          )}
        </UpdatedButton>
      );
    }, [actionButton]);

    return (
      <tr
        className={`border-b border-gray-100 last:border-b-0 ${className || ""}`}
      >
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
                {metadata?.name}
              </span>
            </div>
          </div>
        </td>
        {columns.map((col, index) => (
          <td key={index} className="py-4 px-2 w-[200px]">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-1">{col.title}</span>
              <span className="font-medium text-gray-900">{col.subtitle}</span>
            </div>
          </td>
        ))}
        {/* Placeholders to fill gaps for rows that don't need all the columns */}
        {columnPlaceholders}
        <td className="py-4 pl-4 w-1 whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <div className="w-40">{actionButtonContent}</div>
            <div className="w-9 h-9 flex items-center justify-center">
              {showOverflowMenu &&
                overflowButtons &&
                overflowButtons.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 text-gray-400 hover:text-gray-600 transition-colors outline-none">
                      <EllipsisHorizontalIcon className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {overflowButtons.map((button, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="cursor-pointer flex items-center justify-between"
                          onClick={button.onClick}
                        >
                          <span>{button.title}</span>
                          {button.showExternalIcon && (
                            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2 text-gray-400" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          </div>
        </td>
      </tr>
    );
  }
);

AssetRow.displayName = "AssetRow";
