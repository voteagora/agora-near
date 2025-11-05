"use client";

import { memo, useCallback } from "react";
import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { UpdatedButton } from "../Button";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";

export const DelegationSummaryCard = memo(() => {
  const { signedAccountId } = useNear();
  const { data: accountInfo } = useVenearAccountInfo(signedAccountId);
  const openDialog = useOpenDialog();

  const delegatee = accountInfo?.delegation?.delegatee;
  const hasActiveDelegation = !!delegatee;

  const handleUndelegate = useCallback(() => {
    if (!delegatee) return;
    openDialog({
      type: "NEAR_UNDELEGATE",
      params: { delegateAddress: delegatee },
    });
  }, [delegatee, openDialog]);

  const handleChooseDelegate = useCallback(() => {
    window.location.href = "/delegates";
  }, []);

  if (!accountInfo) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600 mb-1">Delegation</div>
          <div className="text-xl text-gray-900 font-medium">
            {hasActiveDelegation ? (
              <span
                title={delegatee!}
                className="truncate max-w-[280px] inline-block"
              >
                Delegated to {delegatee}
              </span>
            ) : (
              <span>Not delegated</span>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {hasActiveDelegation ? (
            <UpdatedButton type="secondary" onClick={handleUndelegate}>
              Undelegate
            </UpdatedButton>
          ) : (
            <UpdatedButton type="primary" onClick={handleChooseDelegate}>
              Choose a delegate
            </UpdatedButton>
          )}
        </div>
      </div>
    </div>
  );
});

DelegationSummaryCard.displayName = "DelegationSummaryCard";
