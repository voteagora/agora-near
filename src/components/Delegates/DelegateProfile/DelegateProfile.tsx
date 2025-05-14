import { DelegateCardHeader } from "@/components/Delegates/DelegateCard/DelegateCardHeader";
import { formatNumber } from "@/lib/tokenUtils";
import { DelegateCardEditProfile } from "../DelegateCard/DelegateCardEditProfile";
import { DelegateAddress } from "../DelegateCard/DelegateAddress";
import { DelegateActions } from "../DelegateCard/DelegateActions";
import React from "react";
import NearTokenAmount from "@/components/shared/NearTokenAmount";

type DelegateProfileProps = {
  profile: {
    address: string;
    twitter?: string;
    discord?: string;
    email?: string;
    warpcast?: string;
    topIssues?: {
      type: string;
      value: string;
    }[];
    statement?: string;
  };
  isEditMode?: boolean;
  stats?: {
    votingPower?: string;
    numOfDelegators?: string;
    proposalsCreated?: string;
    votedFor?: string;
    votedAgainst?: string;
    votedAbstain?: string;
  };
};

export default function DelegateProfile({
  profile,
  isEditMode,
  stats,
}: DelegateProfileProps) {
  return (
    <div className="flex flex-col static sm:sticky top-16 flex-shrink-0 width-[20rem]">
      <DelegateCardHeader address={profile.address} />
      <div className="flex flex-col bg-wash border border-line shadow-newDefault rounded-xl">
        <div className="flex flex-col items-stretch p-7">
          <DelegateAddress address={profile.address} />
        </div>
        {!isEditMode && (
          <div className="flex flex-col p-7 border-t border-line">
            <div className="flex flex-col gap-4">
              <PanelRow
                title="Voting power"
                detail={
                  <NearTokenAmount
                    amount={stats?.votingPower ?? "0"}
                    hideCurrency
                  />
                }
              />
              <PanelRow
                title="Delegated addresses"
                detail={stats?.numOfDelegators ?? "0"}
              />
              <PanelRow
                title="Proposals created"
                detail={stats?.proposalsCreated ?? "0"}
              />
              <PanelRow
                title="For/Against/Abstain"
                detail={
                  <div className="flex flex-row gap-2">
                    <span className="text-positive font-bold border border-line rounded-md px-2 py-1">
                      {stats?.votedFor ?? "0"}
                    </span>
                    <span className="text-negative font-bold border border-line rounded-md px-2 py-1">
                      {stats?.votedAgainst ?? "0"}
                    </span>
                    <span className="text-tertiary font-bold border border-line rounded-md px-2 py-1">
                      {stats?.votedAbstain ?? "0"}
                    </span>
                  </div>
                }
              />
              <DelegateActions
                address={profile.address}
                twitter={profile.twitter}
                discord={profile.discord}
                warpcast={profile.warpcast}
              />
            </div>
          </div>
        )}
        <DelegateCardEditProfile delegateAddress={profile.address} />
      </div>
    </div>
  );
}

export const PanelRow = ({
  title,
  detail,
  className,
}: {
  title: string;
  detail: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-row gap-2 justify-between items-center ${className}`}
    >
      <span className="whitespace-nowrap text-secondary">{title}</span>
      <span className="text-right text-secondary font-bold">{detail}</span>
    </div>
  );
};

export const DelegateCardSkeleton = () => {
  return (
    <div className="flex flex-col static sm:sticky top-16 flex-shrink-0 width-[20rem] h-[300px] bg-tertiary/10 animate-pulse rounded-lg"></div>
  );
};
