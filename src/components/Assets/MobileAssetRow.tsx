import { TokenMetadata } from "@/lib/types";
import { Popover, Transition } from "@headlessui/react";
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { memo, useMemo } from "react";
import { createPortal } from "react-dom";
import { UpdatedButton } from "../Button";
import LoadingSpinner from "../shared/LoadingSpinner";

type OverflowButton = {
  title: string;
  onClick: () => void;
  showExternalIcon?: boolean;
};

type MobileAssetRowProps = {
  metadata?: TokenMetadata | null;
  columns: {
    title: React.ReactNode;
    subtitle: React.ReactNode;
  }[];
  overflowButtons?: OverflowButton[];
  actionButton?: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  };
};

const variants = {
  hidden: { y: "100%" },
  show: { y: "0%" },
  exit: { y: "100%" },
};

export const MobileAssetRow = memo(
  ({
    metadata,
    columns,
    overflowButtons,
    actionButton,
  }: MobileAssetRowProps) => {
    const hasActionButtons = useMemo(() => {
      return (
        !!actionButton || (!!overflowButtons && overflowButtons.length > 0)
      );
    }, [actionButton, overflowButtons]);

    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              onClick={(e) => {
                if (!hasActionButtons) {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
              className={`w-full bg-white border border-gray-200 rounded-xl p-4 mb-3 outline-none hover:bg-gray-50 transition-colors text-left`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-4">
                    <span className="font-medium text-gray-900 text-lg">
                      {metadata?.name}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {columns.map((col, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-sm text-gray-600">
                          {col.title}
                        </span>
                        <span className="font-medium text-gray-900">
                          {col.subtitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {hasActionButtons ? (
                  <div className="flex items-center ml-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <ArrowRightIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : null}
              </div>
            </Popover.Button>

            {open && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  className="z-[60] bg-black fixed top-0 left-0 right-0 bottom-0"
                />
              </AnimatePresence>
            )}

            <Transition className="absolute z-[70]">
              <Popover.Panel>
                {({ close }) =>
                  createPortal(
                    <motion.div
                      className="bg-white py-8 px-6 rounded-t-lg w-full fixed z-[70] bottom-0 left-0 border-t border-gray-200"
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      variants={variants}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col gap-4 min-h-[150px]">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={metadata?.icon ?? ""}
                              alt={metadata?.name ?? ""}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-900 text-lg">
                            {metadata?.name}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 grow justify-end">
                          {actionButton && (
                            <UpdatedButton
                              className="w-full"
                              variant="rounded"
                              onClick={() => {
                                actionButton.onClick();
                                close();
                              }}
                              type={
                                actionButton.disabled ? "disabled" : "primary"
                              }
                              disabled={actionButton.disabled}
                            >
                              {actionButton.isLoading ? (
                                <div className="flex items-center justify-center">
                                  <LoadingSpinner />
                                </div>
                              ) : (
                                actionButton.title
                              )}
                            </UpdatedButton>
                          )}
                          {overflowButtons?.map((button, index) => (
                            <button
                              key={index}
                              className="w-full flex items-center justify-center gap-2 font-bold text-md"
                              onClick={() => {
                                button.onClick();
                                close();
                              }}
                            >
                              <span>{button.title}</span>
                              {button.showExternalIcon && (
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>,
                    document.body
                  )
                }
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  }
);

MobileAssetRow.displayName = "MobileAssetRow";
