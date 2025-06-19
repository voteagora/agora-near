import { DelegateCardHeader } from "@/components/Delegates/DelegateCard/DelegateCardHeader";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import React from "react";
import { DelegateActions } from "../DelegateCard/DelegateActions";
import { DelegateAddress } from "../DelegateCard/DelegateAddress";
import { DelegateCardEditProfile } from "../DelegateCard/DelegateCardEditProfile";

type DelegateProfileProps = {
  profile: {
    address: string;
    twitter?: string | null;
    discord?: string | null;
    email?: string | null;
    warpcast?: string | null;
    topIssues?:
      | {
          type: string;
          value: string;
        }[]
      | null;
    statement?: string | null;
  };
  isEditMode?: boolean;
  stats?: {
    votingPower?: string | null;
    numOfDelegators?: string | null;
    proposalsCreated?: string | null;
    votedFor?: string | null;
    votedAgainst?: string | null;
    votedAbstain?: string | null;
    participationRate?: string | null;
  };
};

export default function DelegateProfile({
  profile,
  isEditMode,
  stats,
}: DelegateProfileProps) {
  return (
    <div className="flex flex-col static sm:sticky top-16 flex-shrink-0 width-[20rem]">
      {stats?.participationRate && (
        <DelegateCardHeader participationRate={stats?.participationRate} />
      )}
      <div className="flex flex-col bg-wash border border-line shadow-newDefault rounded-xl">
        <div className="flex flex-col items-stretch p-7">
          <DelegateAddress address={profile.address} shouldTruncate={false} />
        </div>
        {!isEditMode && (
          <div className="flex flex-col p-7 border-t border-line">
            <div className="flex flex-col gap-4">
              <PanelRow
                title="Voting power"
                detail={
                  <NearTokenAmount
                    amount={stats?.votingPower ?? "0"}
                    currency="veNEAR"
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
                title="For/Against"
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
