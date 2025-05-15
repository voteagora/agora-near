"use client";

import { rgbStringToHex } from "@/app/lib/utils/color";
import { useNearTokenBalance } from "@/hooks/useNearTokenBalance";
import { useVotingPower } from "@/hooks/useVotingPower";
import { Logout } from "@/icons/logout";
import walletIcon from "@/icons/wallet.svg";
import Tenant from "@/lib/tenant/tenant";
import { Popover, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { AccountActionsButton } from "../AccountActions/AccountActionsButton";
import { PanelRow } from "../Delegates/DelegateProfile/DelegateProfile";
import NearTokenAmount from "../shared/NearTokenAmount";
import { formatNearAccountId } from "@/lib/utils";

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
    useNearTokenBalance(shouldHydrate ? accountId : undefined);

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
              <div className="w-6 h-6 shadow-newDefault rounded-full">
                <Image
                  height={walletIcon.height}
                  width={walletIcon.width}
                  src={walletIcon.src}
                  alt="Wallet"
                />
              </div>
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
                      className="bg-neutral py-8 px-6 rounded-t-lg w-full fixed z-[70] bottom-0 left-0"
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      variants={variants}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col gap-3 min-h-[280px] justify-center">
                        <div className="mb-1">
                          <span className="text-primary">
                            {formatNearAccountId(accountId)}
                          </span>
                        </div>
                        <div className="self-stretch py-8 flex flex-col gap-6">
                          <PanelRow
                            title={
                              ui.tacticalStrings?.myBalance ||
                              "My token balance"
                            }
                            detail={
                              <RowSkeletonWrapper
                                isLoading={isFetchingTokenBalance}
                              >
                                <NearTokenAmount
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
                                <NearTokenAmount
                                  amount={votingPower || BigInt(0)}
                                  currency="veNEAR"
                                />
                              </RowSkeletonWrapper>
                            }
                          />
                          <AccountActionsButton />
                        </div>
                        <div className="py-4 border-t border-line bg-neutral rounded-[0px_0px_12px_12px]">
                          <div
                            onClick={() => signOut()}
                            className="cursor-pointer flex"
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
