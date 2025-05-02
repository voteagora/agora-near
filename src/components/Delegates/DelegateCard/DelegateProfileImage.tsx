"use client";

import ENSAvatar from "../../shared/ENSAvatar";
import CopyableHumanAddress from "../../shared/CopyableHumanAddress";
import { useEnsName } from "wagmi";
import { formatNumber } from "@/lib/tokenUtils";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useConnectButtonContext } from "@/contexts/ConnectButtonContext";
import { formatEther } from "viem";
import Tenant from "@/lib/tenant/tenant";
import { icons } from "@/icons/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UIEndorsedConfig } from "@/lib/tenant/tenantUI";
import ENSName from "@/components/shared/ENSName";
import { CollapsibleText } from "@/components/shared/CollapsibleText";
import { SCWProfileImage } from "./SCWProfileImage";

interface Props {
  address: string;
  endorsed: boolean;
}

export function DelegateProfileImage({ address, endorsed }: Props) {
  const { ui } = Tenant.current();

  const endorsedToggle = ui.toggle("delegates/endorsed-filter");
  const hasEndorsedFilter = Boolean(
    endorsedToggle?.enabled && endorsedToggle?.config !== undefined
  );

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex flex-col">
        <div className="text-primary flex flex-row gap-1 font-semibold hover:opacity-90">
          <CopyableHumanAddress address={address} />
          {endorsed && hasEndorsedFilter && endorsedToggle && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src={icons.endorsed}
                    alt={(endorsedToggle.config as UIEndorsedConfig).tooltip}
                    className="w-4 h-4"
                  />
                </TooltipTrigger>

                <TooltipContent>
                  <div className="text-xs">
                    {(endorsedToggle.config as UIEndorsedConfig).tooltip}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}

export function DelegateProfileImageWithMetadata({
  address,
  endorsed,
  description,
  location,
  followersCount,
  followingCount,
}: Props & {
  description?: string;
  location?: string;
  followersCount?: string;
  followingCount?: string;
}) {
  const { ui } = Tenant.current();
  const endorsedToggle = ui.toggle("delegates/endorsed-filter");
  const hasEndorsedFilter = Boolean(
    endorsedToggle?.enabled && endorsedToggle?.config !== undefined
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-col">
          <div className="text-primary flex flex-row gap-1 font-semibold hover:opacity-90">
            <CopyableHumanAddress
              address={address}
              className="overflow-hidden"
            />
            {endorsed && hasEndorsedFilter && endorsedToggle && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Image
                      src={icons.endorsed}
                      alt={(endorsedToggle.config as UIEndorsedConfig).tooltip}
                      className="w-4 h-4"
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    <div className="text-xs">
                      {(endorsedToggle.config as UIEndorsedConfig).tooltip}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {!!location && (
            <div className="text-sm text-secondary">{location}</div>
          )}
          {!!followersCount && !!followingCount && (
            <div className="text-xs text-primary font-medium">
              <span className="font-bold">{followingCount}</span> following ·{" "}
              <span className="font-bold">{followersCount}</span> followers
            </div>
          )}
        </div>
      </div>
      {!!description && (
        <div className="text-sm text-secondary">
          <CollapsibleText text={description} />
        </div>
      )}
    </div>
  );
}
