"use client";

import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { memo } from "react";
import AgoraLoader from "../shared/AgoraLoader/AgoraLoader";
import { AssetsLandingPage } from "./AssetsLandingPage";
import { useVotingPower } from "@/hooks/useVotingPower";
import { VotingPowerCard } from "./VotingPowerCard";
import { GovernanceRewardsCard } from "./GovernanceRewardsCard";
import { HoldingsSection } from "./HoldingsSection";

export const AssetsHome = memo(() => {
  const { signedAccountId } = useNear();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useVenearAccountInfo(signedAccountId);

  const { data: votingPower } = useVotingPower(signedAccountId);

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
      {/* Header Cards - Always horizontal */}
      <div className="flex flex-row gap-6 p-6">
        <div className="w-[70%] flex">
          <VotingPowerCard votingPower={votingPower} />
        </div>
        <div className="w-[30%] flex">
          <GovernanceRewardsCard />
        </div>
      </div>

      {/* Holdings Section */}
      <HoldingsSection />
    </div>
  );
});

AssetsHome.displayName = "AssetsHome";
