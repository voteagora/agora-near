"use client";

import { rgbStringToHex } from "@/app/lib/utils/color";
import { useNearTokenBalance } from "@/hooks/useNearTokenBalance";
import { useVotingPower } from "@/hooks/useVotingPower";
import { Logout } from "@/icons/logout";
import Tenant from "@/lib/tenant/tenant";
import { Popover, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { AccountActionsButton } from "../AccountActions/AccountActionsButton";
import { PanelRow } from "../Delegates/DelegateCard/DelegateCard";
import NearTokenAmount from "../shared/NearTokenAmount";

type Props = {
  accountId?: string;
  signOut: () => void;
};

export const DesktopProfileDropDown = ({ accountId, signOut }: Props) => {
  const { ui } = Tenant.current();

  // Don't hydrate the component until the user clicks on the profile dropdown
  const [shouldHydrate, setShouldHydrate] = useState(false);

  const { data: tokenBalance, isFetching: isFetchingTokenBalance } =
    useNearTokenBalance(shouldHydrate ? accountId : undefined);

  const { data: votingPower = "0", isLoading: isLoadingVotingPower } =
    useVotingPower(shouldHydrate ? accountId : undefined);

  return (
    <Popover className="relative cursor-auto">
      {({ open }) => {
        return (
          <>
            <Popover.Button
              className="flex outline-none"
              onClick={() => setShouldHydrate(true)}
            >
              <div className="text-primary flex items-center gap-3">
                {accountId}
              </div>
            </Popover.Button>

            {open && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  className="z-[60] bg-black fixed top-0 bottom-0 right-0 left-0"
                />
              </AnimatePresence>
            )}

            <Transition
              className="absolute right-0 z-[100]"
              enter="transition duration-00 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel>
                {({ close }) => (
                  <div className="bg-wash border border-line rounded-xl w-[350px]">
                    <div className="flex flex-col min-h-[250px]">
                      <div className="flex flex-col">
                        <div className="p-4 border-b border-line">
                          <div className="flex flex-row items-center px-4 py-3">
                            <div className="flex flex-col justify-center">
                              {accountId}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch py-8 px-4 flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                          <PanelRow
                            title={
                              ui.tacticalStrings?.myBalance || "My balance"
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
                            className="w-[300px] justify-between"
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
                            className="w-[300px] justify-between"
                          />
                        </div>
                        <AccountActionsButton />
                      </div>
                      <div className="p-4 border-t border-line bg-neutral rounded-[0px_0px_12px_12px]">
                        <div onClick={signOut} className="cursor-pointer flex">
                          <Logout
                            fill={rgbStringToHex(ui?.customization?.primary)}
                            className={"mr-[10px] self-center cursor-pointer"}
                          />
                          <span>Logout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
