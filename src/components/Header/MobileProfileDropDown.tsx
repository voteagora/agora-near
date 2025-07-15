"use client";

import { rgbStringToHex } from "@/lib/color";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useVotingPower } from "@/hooks/useVotingPower";
import { Logout } from "@/assets/logout";

import Tenant from "@/lib/tenant/tenant";
import { Popover, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { AccountActions } from "../AccountActions/AccountActionsButton";
import { PanelRow } from "../Delegates/DelegateProfile/DelegateProfile";
import TokenAmount from "../shared/TokenAmount";
import { formatNearAccountId } from "@/lib/utils";
import NearAvatar from "../shared/NearAvatar";

type Props = {
  accountId: string | undefined;
  signOut: () => void;
};

// Add your variants
const variants = {
  hidden: { y: "100%" },
  show: { y: "0%" },
  exit: { y: "100%" },
};

export const MobileProfileDropDown = ({ accountId, signOut }: Props) => {
  const { ui } = Tenant.current();

  // Don't hydrate the component until the user clicks on the profile dropdown
  const [shouldHydrate, setShouldHydrate] = useState(false);

  const { data: tokenBalance, isFetching: isFetchingTokenBalance } =
    useTokenBalance(shouldHydrate ? accountId : undefined);

  const { data: votingPower, isLoading: isLoadingVotingPower } = useVotingPower(
    shouldHydrate ? accountId : undefined
  );

  return (
    <Popover className="relative cursor-auto">
      {({ open }) => {
        return (
          <>
            <Popover.Button
              className="mt-1 outline-none"
              onClick={() => setShouldHydrate(true)}
            >
              <NearAvatar accountId={accountId} size={24} />
            </Popover.Button>

            {open && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  className={
                    "z-[60] bg-black fixed top-0 left-0 right-0 bottom-0"
                  }
                />
              </AnimatePresence>
            )}

            <Transition className="absolute z-[70]">
              <Popover.Panel>
                {({ close }) =>
                  createPortal(
                    <motion.div
                      className="bg-wash rounded-t-2xl w-full fixed z-[70] bottom-0 left-0"
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      variants={variants}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col min-h-[280px]">
                        <div className="flex flex-col px-6 py-[30px] border-b border-line">
                          <div className="flex flex-row items-center gap-2 text-primary">
                            <NearAvatar accountId={accountId} size={50} />
                            <div className="flex flex-col flex-1">
                              <span className="text-primary font-bold">
                                {formatNearAccountId(accountId)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="self-stretch flex flex-col font-medium bg-neutral">
                          <div className="py-4 px-6 flex gap-4 flex-col">
                            <PanelRow
                              title={
                                ui.tacticalStrings?.myBalance ||
                                "My token balance"
                              }
                              detail={
                                <RowSkeletonWrapper
                                  isLoading={isFetchingTokenBalance}
                                >
                                  <TokenAmount
                                    amount={tokenBalance || BigInt(0)}
                                  />
                                </RowSkeletonWrapper>
                              }
                            />
                            <PanelRow
                              title="My voting power"
                              detail={
                                <RowSkeletonWrapper
                                  isLoading={isLoadingVotingPower}
                                >
                                  <TokenAmount
                                    amount={votingPower || BigInt(0)}
                                    currency="veNEAR"
                                  />
                                </RowSkeletonWrapper>
                              }
                            />
                          </div>

                          <div className="flex flex-col p-6 font-medium">
                            <AccountActions close={close} />
                          </div>
                        </div>

                        <div className="p-6 py-[30px] border-t border-line bg-wash rounded-bl-[16px] rounded-br-[16px]">
                          <div
                            onClick={signOut}
                            className="cursor-pointer flex font-bold"
                          >
                            <Logout
                              fill={rgbStringToHex(ui?.customization?.primary)}
                              className={"mr-[10px] self-center"}
                            />
                            <span className="text-primary">Logout</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>,
                    document.body
                  )
                }
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
};

const RowSkeletonWrapper = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) =>
  isLoading ? (
    <div className="animate-pulse bg-tertiary/10 h-5 w-[90px] rounded-2xl"></div>
  ) : (
    <div className="text-primary">{children}</div>
  );
