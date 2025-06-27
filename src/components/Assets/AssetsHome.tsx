"use client";

import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { memo } from "react";
import AgoraLoader from "../shared/AgoraLoader/AgoraLoader";
import { AssetsLandingPage } from "./AssetsLandingPage";
import { GovernanceRewardsCard } from "./GovernanceRewardsCard";
import { HoldingsSection } from "./HoldingsSection";
import { VotingPowerCard } from "./VotingPowerCard";

export const AssetsHome = memo(() => {
  const { signedAccountId } = useNear();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useVenearAccountInfo(signedAccountId);

  if (isLoadingAccount) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <AgoraLoader />
      </div>
    );
  }

  if (!accountInfo) {
    return <AssetsLandingPage />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
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
