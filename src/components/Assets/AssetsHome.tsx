"use client";

import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { useVenearConfig } from "@/hooks/useVenearConfig";
import { MIN_VERSION_FOR_LST_LOCKUP } from "@/lib/constants";
import { memo, useMemo } from "react";
import { UpdatedButton } from "@/components/Button";
import { LiquidStakingTokenLockWarning } from "../Dialogs/LockDialog/LiquidStakingTokenLockWarning";
import AgoraLoader from "../shared/AgoraLoader/AgoraLoader";
import { AssetsLandingPage } from "./AssetsLandingPage";
import { GovernanceRewardsCard } from "./GovernanceRewardsCard";
import { HoldingsSection } from "./HoldingsSection";
import { VotingPowerCard } from "./VotingPowerCard";

export const AssetsHome = memo(() => {
  const { signedAccountId } = useNear();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useVenearAccountInfo(signedAccountId);

  const { lockupVersion, isLoading: isLoadingVenearConfig } = useVenearConfig({
    enabled: true,
  });

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
    return <AssetsLandingPage shouldShowLSTWarning={shouldShowLSTWarning} />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="sm:px-6 px-2 mt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Onboard legacy staked tokens</div>
            <div className="text-sm text-[#6B7280]">
              Lock and stake with a custom, whitelisted staking pool.
            </div>
          </div>
          <UpdatedButton href="/near/legacy-onboarding" variant="rounded">
            Get started
          </UpdatedButton>
        </div>
      </div>
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
      <HoldingsSection />
    </div>
  );
});

AssetsHome.displayName = "AssetsHome";
