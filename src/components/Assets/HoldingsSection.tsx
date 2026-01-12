import { useNear } from "@/contexts/NearContext";
import { memo, useCallback, useState } from "react";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { HoldingsContent } from "./HoldingsContent";
import { HosActivityTable } from "./HosActivityTable";

export const HoldingsSection = memo(() => {
  const [activeTab, setActiveTab] = useState<"Holdings" | "Activity">(
    "Holdings"
  );

  const { signedAccountId } = useNear();

  const handleTabClick = useCallback((tab: "Holdings" | "Activity") => {
    setActiveTab(tab);
  }, []);

  const openDialog = useOpenDialog();

  const openLockDialog = useCallback(
    (preSelectedTokenId?: string | null) => {
      openDialog({
        type: "NEAR_LOCK",
        params: {
          source: "account_management",
          preSelectedTokenId: preSelectedTokenId ?? undefined,
        },
      });
    },
    [openDialog]
  );

  const openStakingDialog = useCallback(() => {
    openDialog({
      type: "NEAR_STAKING",
      className: "sm:w-[500px]",
      params: {
        source: "account_management",
      },
    });
  }, [openDialog]);

  const openUnstakeDialog = useCallback(() => {
    openDialog({
      type: "NEAR_UNSTAKE",
      params: {},
    });
  }, [openDialog]);

  return (
    <div className="flex-1 sm:px-6 pb-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabClick("Holdings")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "Holdings"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Holdings
          </button>
          <button
            onClick={() => handleTabClick("Activity")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "Activity"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Activity
          </button>
        </div>

        <div className="sm:px-6 py-6 px-2">
          {activeTab === "Holdings" ? (
            <HoldingsContent
              openLockDialog={openLockDialog}
              openStakingDialog={openStakingDialog}
              openUnstakeDialog={openUnstakeDialog}
            />
          ) : (
            <HosActivityTable address={signedAccountId} />
          )}
        </div>
      </div>
    </div>
  );
});

HoldingsSection.displayName = "HoldingsSection";
