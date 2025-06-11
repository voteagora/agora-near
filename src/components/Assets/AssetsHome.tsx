"use client";

import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { memo } from "react";
import AgoraLoader from "../shared/AgoraLoader/AgoraLoader";
import { AssetsLandingPage } from "./AssetsLandingPage";
import { useVotingPower } from "@/hooks/useVotingPower";
import NearTokenAmount from "../shared/NearTokenAmount";

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

  return accountInfo ? (
    <div className="flex flex-col w-full min-h-screen justify-center items-center">
      Your voting power: <NearTokenAmount amount={votingPower ?? "0"} />
    </div>
  ) : (
    <AssetsLandingPage />
  );
});

AssetsHome.displayName = "AssetsHome";
