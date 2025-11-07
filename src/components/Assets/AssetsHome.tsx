"use client";

import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { useVenearConfig } from "@/hooks/useVenearConfig";
import {
  MIN_VERSION_FOR_LST_LOCKUP,
  LEGACY_STAKING_DISMISSED_KEY,
} from "@/lib/constants";
import { memo, useMemo } from "react";
import { UpdatedButton } from "@/components/Button";
import { LiquidStakingTokenLockWarning } from "../Dialogs/LockDialog/LiquidStakingTokenLockWarning";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import AgoraLoader from "../shared/AgoraLoader/AgoraLoader";
import { AssetsLandingPage } from "./AssetsLandingPage";
import { GovernanceRewardsCard } from "./GovernanceRewardsCard";
import { HoldingsSection } from "./HoldingsSection";
import { VotingPowerCard } from "./VotingPowerCard";
import { DelegationSummaryCard } from "./DelegationSummaryCard";

export const AssetsHome = memo(() => {
  const { signedAccountId, signIn } = useNear();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useVenearAccountInfo(signedAccountId);
  const [isLegacyDismissed, setLegacyDismissed] = useLocalStorage(
    LEGACY_STAKING_DISMISSED_KEY,
    false
  );

  const { lockupVersion, isLoading: isLoadingVenearConfig } = useVenearConfig({
    enabled: true,
  });

  const openDialog = useOpenDialog();

  const handleLandingGetStarted = () => {
    if (!signedAccountId) {
      signIn();
      return;
    }
    openDialog({
      type: "NEAR_LOCK",
      params: {
        source: "onboarding",
      },
    });
  };

  const shouldShowLSTWarning = useMemo(() => {
    // Your lockup version takes precedence if you have onboarded, otherwise use global lockup version
    const lockupVersionToCheck = accountInfo?.lockupVersion ?? lockupVersion;

    return lockupVersionToCheck < MIN_VERSION_FOR_LST_LOCKUP;
  }, [accountInfo?.lockupVersion, lockupVersion]);

  if (isLoadingAccount || isLoadingVenearConfig) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <AgoraLoader />
      </div>
    );
  }

  if (!accountInfo) {
    return (
      <div className="flex flex-col w-full min-h-screen">
        {!isLegacyDismissed && (
          <div className="w-full mt-4">
            <div
              className="relative flex flex-col border border-black shadow-lg rounded-lg p-4"
              style={{ backgroundColor: "#00E391" }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-1">
                    Have tokens staked in a custom pool?
                  </h3>
                  <p className="text-sm text-black/80">
                    Bring your legacy staked tokens into House of Stake for
                    governance.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <UpdatedButton
                    variant="rounded"
                    className="whitespace-nowrap !border-black"
                    onClick={handleLandingGetStarted}
                  >
                    Get Started
                  </UpdatedButton>
                  <button
                    onClick={() => setLegacyDismissed(true)}
                    className="p-1 hover:bg-black/5 rounded-md"
                    aria-label="Dismiss legacy banner"
                  >
                    <XMarkIcon className="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <AssetsLandingPage shouldShowLSTWarning={shouldShowLSTWarning} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Legacy Staked Tokens CTA */}
      {!isLegacyDismissed && (
        <div className="w-full mt-4">
          <div
            className="relative flex flex-col border border-black shadow-lg rounded-lg p-4"
            style={{ backgroundColor: "#00E391" }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-1">
                  Have tokens staked in a custom pool?
                </h3>
                <p className="text-sm text-black/80">
                  Bring your legacy staked tokens into House of Stake for
                  governance.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/assets/legacy-staking">
                  <UpdatedButton
                    variant="rounded"
                    className="whitespace-nowrap !border-black"
                  >
                    Get Started
                  </UpdatedButton>
                </Link>
                <button
                  onClick={() => setLegacyDismissed(true)}
                  className="p-1 hover:bg-black/5 rounded-md"
                  aria-label="Dismiss legacy banner"
                >
                  <XMarkIcon className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {shouldShowLSTWarning && (
        <div className="w-full bg-[#F9F8F7] border-b border-gray-200 px-4 py-3 mt-4 rounded-2xl">
          <div className="mx-auto">
            <LiquidStakingTokenLockWarning />
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-6 sm:px-6 py-6">
        <div className="w-full sm:w-[70%] flex">
          <VotingPowerCard />
        </div>
        <div className="w-full sm:w-[30%] flex">
          <GovernanceRewardsCard />
        </div>
      </div>
      <div className="flex flex-col sm:px-6 -mt-2">
        <DelegationSummaryCard />
      </div>
      <HoldingsSection />
    </div>
  );
});

AssetsHome.displayName = "AssetsHome";
