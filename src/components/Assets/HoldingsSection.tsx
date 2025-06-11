import { memo, useCallback, useState } from "react";
import { AssetRow } from "./AssetRow";
import {
  VENEAR_TOKEN_METADATA,
  NEAR_TOKEN_METADATA,
  LINEAR_TOKEN_METADATA,
  STNEAR_TOKEN_METADATA,
} from "@/lib/constants";

// Mock data for holdings - replace with actual data later
const mockHoldingsData = [
  {
    id: "venear",
    metadata: VENEAR_TOKEN_METADATA,
    status: "Locked" as const,
    amount: "999999999",
    showOverflowMenu: true,
    buttonType: null,
  },
  {
    id: "near",
    metadata: NEAR_TOKEN_METADATA,
    status: "Lockable" as const,
    amount: "20000",
    showOverflowMenu: false,
    buttonType: "Lock & Stake" as const,
  },
  {
    id: "linear",
    metadata: LINEAR_TOKEN_METADATA,
    status: "Lockable" as const,
    amount: "200",
    showOverflowMenu: true,
    buttonType: "Lock" as const,
  },
  {
    id: "stnear",
    metadata: STNEAR_TOKEN_METADATA,
    status: "Lockable" as const,
    amount: "0",
    showOverflowMenu: true,
    buttonType: "Lock" as const,
  },
];

export const HoldingsSection = memo(() => {
  const [activeTab, setActiveTab] = useState<"Holdings" | "Activity">(
    "Holdings"
  );

  const handleTabClick = useCallback((tab: "Holdings" | "Activity") => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Tabs */}
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "Holdings" ? (
            <table className="w-full">
              <tbody>
                {mockHoldingsData.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    id={asset.id}
                    metadata={asset.metadata}
                    status={asset.status}
                    amount={asset.amount}
                    showOverflowMenu={asset.showOverflowMenu}
                    buttonType={asset.buttonType}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Activity tab content coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

HoldingsSection.displayName = "HoldingsSection";
