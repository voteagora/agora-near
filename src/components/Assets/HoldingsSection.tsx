import { useAvailableTokens } from "@/hooks/useAvailableTokens";
import { useVotingPower } from "@/hooks/useVotingPower";
import { VENEAR_TOKEN_METADATA } from "@/lib/constants";
import { memo, useCallback, useState } from "react";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import NearTokenAmount from "../shared/NearTokenAmount";
import { Skeleton } from "../ui/skeleton";
import { AssetRow } from "./AssetRow";
import { useNear } from "@/contexts/NearContext";

export const HoldingsSection = memo(() => {
  const [activeTab, setActiveTab] = useState<"Holdings" | "Activity">(
    "Holdings"
  );

  const { signedAccountId } = useNear();

  const handleTabClick = useCallback((tab: "Holdings" | "Activity") => {
    setActiveTab(tab);
  }, []);

  const { isLoading: isLoadingAvailableTokens, availableTokens } =
    useAvailableTokens();

  const { data: votingPower, isLoading: isLoadingVotingPower } =
    useVotingPower(signedAccountId);

  const openDialog = useOpenDialog();

  const openLockDialog = useCallback(
    (preSelectedTokenId?: string) => {
      openDialog({
        type: "NEAR_LOCK",
        params: {
          source: "account_management",
          preSelectedTokenId,
        },
      });
    },
    [openDialog]
  );

  if (isLoadingAvailableTokens || isLoadingVotingPower) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pb-6">
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

        <div className="p-6">
          {activeTab === "Holdings" ? (
            <table className="w-full">
              <tbody>
                <AssetRow
                  metadata={VENEAR_TOKEN_METADATA}
                  columns={[
                    {
                      title: "Locked",
                      subtitle: (
                        <NearTokenAmount
                          amount={votingPower ?? "0"}
                          currency={VENEAR_TOKEN_METADATA.symbol}
                          maximumSignificantDigits={6}
                        />
                      ),
                    },
                  ]}
                  showOverflowMenu
                />
                {availableTokens.map((token) => (
                  <AssetRow
                    key={token.accountId}
                    metadata={token.metadata}
                    columns={[
                      {
                        title: "Lockable",
                        subtitle: (
                          <NearTokenAmount
                            amount={token.balance}
                            currency={token.metadata?.symbol}
                            maximumSignificantDigits={6}
                          />
                        ),
                      },
                    ]}
                    showOverflowMenu
                    actionButton={{
                      title: token.type === "lst" ? "Lock" : "Lock & Stake",
                      onClick: () => openLockDialog(token.accountId),
                    }}
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
