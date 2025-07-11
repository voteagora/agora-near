"use client";

import { UpdatedButton } from "@/components/Button";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { DelegateProfile } from "@/lib/api/delegates/types";
import Tenant from "@/lib/tenant/tenant";
import { type SyntheticEvent } from "react";
import { DelegateSocialLinks } from "./DelegateSocialLinks";

type DelegateActionsProps = {
  delegate: DelegateProfile;
};

export function DelegateActions({ delegate }: DelegateActionsProps) {
  const { signedAccountId, signIn } = useNear();
  const { data: accountInfo } = useVenearAccountInfo(signedAccountId);

  const openDialog = useOpenDialog();

  const isDelegated = accountInfo?.delegation?.delegatee === delegate.address;

  const isOwnAccount = delegate.address === signedAccountId;

  const { ui } = Tenant.current();

  const isRetired = ui.delegates?.retired.includes(
    delegate.address.toLowerCase() as `0x${string}`
  );

  const handleDelegate = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!signedAccountId) {
      signIn();
    } else {
      openDialog({
        type: isDelegated ? "NEAR_UNDELEGATE" : "NEAR_DELEGATE",
        params: {
          delegateAddress: delegate.address,
        },
      });
    }
  };

  if (isRetired) {
    return (
      <div className="rounded-lg border border-line p-2 bg-line text-xs font-medium text-secondary">
        This voter has stepped down. If you are currently delegated to them,
        please select a new voter.
      </div>
    );
  }

  return (
    <div className="flex flex-row items-stretch justify-between">
      <DelegateSocialLinks
        discord={delegate.discord}
        twitter={delegate.twitter}
        warpcast={delegate.warpcast}
      />
      {!isOwnAccount && (
        <UpdatedButton type="secondary" onClick={handleDelegate}>
          {isDelegated ? "Undelegate" : "Delegate"}
        </UpdatedButton>
      )}
    </div>
  );
}
