"use client";

import { rgbStringToHex } from "@/lib/color";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useVotingPower } from "@/hooks/useVotingPower";
import { Logout } from "@/assets/logout";
import Tenant from "@/lib/tenant/tenant";
import { Popover, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { AccountActions } from "../AccountActions/AccountActionsButton";
import { PanelRow } from "../Delegates/DelegateProfile/DelegateProfile";
import TokenAmount from "../shared/TokenAmount";

import { formatNearAccountId } from "@/lib/utils";
import NearAvatar from "../shared/NearAvatar";

type Props = {
  accountId?: string;
  signOut: () => void;
};

export const DesktopProfileDropDown = ({ accountId, signOut }: Props) => {
  const { ui } = Tenant.current();

  // Don't hydrate the component until the user clicks on the profile dropdown
  const [shouldHydrate, setShouldHydrate] = useState(false);

  const { data: tokenBalance, isFetching: isFetchingTokenBalance } =
    useTokenBalance(shouldHydrate ? accountId : undefined);

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
                <NearAvatar accountId={accountId} size={28} />
                <div className="hidden lg:inline">
                  {accountId && <span>{formatNearAccountId(accountId)}</span>}
                </div>
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
                  <div className="bg-wash border border-line rounded-[16px] w-[376px] shadow-newPopover">
                    <div className="flex flex-col min-h-[250px]">
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

                      <div className="p-6 py-[30px] border-t border-line bg-wash sm:rounded-bl-[16px] sm:rounded-br-[16px]">
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
