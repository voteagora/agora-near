"use client";

import { rgbStringToHex } from "@/app/lib/utils/color";
import { useNearTokenBalance } from "@/hooks/useNearTokenBalance";
import { useVotingPower } from "@/hooks/useVotingPower";
import { Logout } from "@/icons/logout";
import Tenant from "@/lib/tenant/tenant";
import { Popover, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { PanelRow } from "../Delegates/DelegateCard/DelegateCard";
import NearTokenAmount from "../shared/NearTokenAmount";
import { useCheckVoterStatus } from "@/hooks/useCheckVoterStatus";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useVenearConfig } from "@/hooks/useVenearConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useRegisterLockup } from "@/hooks/useRegisterLockup";

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

  const { totalRegistrationCost, lockupStorageCost, venearStorageCost } =
    useVenearConfig({
      enabled: shouldHydrate,
    });

  const { isRegisteredToVote, isLoading: isLoadingVoterRegistration } =
    useCheckVoterStatus({
      enabled: shouldHydrate,
    });

  const { registerAndDeployLockup, isPending: isRegisteringToVote } =
    useRegisterLockup();

  const accountActionButton = useMemo(() => {
    if (isLoadingVoterRegistration) {
      return <Skeleton className="w-full mx-2 h-12 rounded-full" />;
    }

    if (!isRegisteredToVote) {
      return (
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="flex flex-row items-center gap-2"
            onClick={() =>
              registerAndDeployLockup(
                String(venearStorageCost),
                String(lockupStorageCost)
              )
            }
            loading={isRegisteringToVote}
          >
            <span>Register to vote</span>
          </Button>
          <TooltipProvider>
            <div className="flex flex-row items-center gap-2 justify-center">
              <p className="text-sm">
                <NearTokenAmount amount={totalRegistrationCost} /> required
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={14} className="opacity-60" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-[350px]">
                    To participate in voting, you'll need to make two deposits:{" "}
                    <br />
                    <br />
                    <div>
                      <span className="font-semibold">Account Deposit:</span>{" "}
                      <NearTokenAmount amount={venearStorageCost} />
                      <br />
                      <br />
                      This covers your account storage in the veNEAR contract.
                      This amount is locked immediately and cannot be withdrawn.
                      <br />
                      <br />
                      <span className="font-semibold">Lockup Deposit: </span>
                      <NearTokenAmount amount={lockupStorageCost} />
                      <br />
                      <br />
                      This covers your lockup contract's operational costs. This
                      amount stays in your lockup contract and can be locked but
                      not staked.
                      <br />
                      <br />
                      <span className="font-semibold">
                        Total Required:
                      </span>{" "}
                      <NearTokenAmount amount={totalRegistrationCost} />
                      <br />
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      );
    }

    return (
      <Link
        href={`/delegates/${accountId}`}
        className="px-5 py-3 rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.03)] border border-neutral-200 flex justify-center"
        onClick={() => close()}
      >
        <span className="text-neutral-900 text-base font-semibold">
          View my profile
        </span>
      </Link>
    );
  }, [isLoadingVoterRegistration, isRegisteredToVote, accountId]);

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
                        <div className="">{accountActionButton}</div>
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
