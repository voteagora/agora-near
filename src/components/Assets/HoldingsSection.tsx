import { useNear } from "@/contexts/NearContext";
import { useAvailableTokens } from "@/hooks/useAvailableTokens";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import {
  LINEAR_TOKEN_CONTRACTS,
  STNEAR_TOKEN_CONTRACTS,
  VENEAR_TOKEN_METADATA,
} from "@/lib/constants";
import Big from "big.js";
import { memo, useCallback, useMemo, useState } from "react";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import NearTokenAmount from "../shared/NearTokenAmount";
import { Skeleton } from "../ui/skeleton";
import { AssetRow } from "./AssetRow";

export const HoldingsSection = memo(() => {
  const [activeTab, setActiveTab] = useState<"Holdings" | "Activity">(
    "Holdings"
  );

  const { signedAccountId, networkId } = useNear();

  const handleTabClick = useCallback((tab: "Holdings" | "Activity") => {
    setActiveTab(tab);
  }, []);

  const { isLoading: isLoadingAvailableTokens, availableTokens } =
    useAvailableTokens();

  const { lockupAccountId, isLoading: isLoadingLockupAccountId } =
    useLockupAccount();

  const { data: accountInfo, isLoading: isLoadingAccountInfo } =
    useVenearAccountInfo(signedAccountId);

  const balanceWithRewards = useMemo(
    () =>
      Big(accountInfo?.totalBalance.near ?? "0")
        .add(accountInfo?.totalBalance.extraBalance ?? "0")
        .toFixed(),
    [accountInfo]
  );

  const { stakingPoolId, isLoadingStakingPoolId } = useCurrentStakingPoolId({
    lockupAccountId,
  });

  const openDialog = useOpenDialog();

  const openLockDialog = useCallback(
    (preSelectedTokenId?: string) => {
      openDialog({
        type: "NEAR_LOCK",
        className: "sm:w-[500px]",
        params: {
          source: "account_management",
          preSelectedTokenId,
        },
      });
    },
    [openDialog]
  );

  const handleUnlock = useCallback(() => {
    // TODO: Implement unlock functionality
    console.log("Unlock clicked");
  }, []);

  const handleManageStaking = useCallback(
    (tokenAccountId: string) => {
      let url = "";

      // Determine the correct URL based on the token
      if (tokenAccountId === LINEAR_TOKEN_CONTRACTS[networkId]) {
        url = "https://app.linearprotocol.org/";
      } else if (tokenAccountId === STNEAR_TOKEN_CONTRACTS[networkId]) {
        url = "https://www.metapool.app/stake/?token=near";
      }

      if (url) {
        window.open(url, "_blank");
      }
    },
    [networkId]
  );

  const isLoading =
    isLoadingAvailableTokens ||
    isLoadingLockupAccountId ||
    isLoadingStakingPoolId ||
    isLoadingAccountInfo;

  if (isLoading) {
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
                          amount={balanceWithRewards}
                          currency={VENEAR_TOKEN_METADATA.symbol}
                          maximumSignificantDigits={4}
                          minimumFractionDigits={4}
                        />
                      ),
                    },
                  ]}
                  showOverflowMenu
                  overflowButtons={[
                    {
                      title: "Unlock",
                      onClick: handleUnlock,
                    },
                  ]}
                />
                {availableTokens.map((token) => {
                  const overflowButtons = [];

                  // Add "Manage staking" button for LST tokens
                  if (token.type === "lst") {
                    overflowButtons.push({
                      title: "Manage staking",
                      onClick: () => handleManageStaking(token.accountId ?? ""),
                      showExternalIcon: true,
                    });
                  }

                  return (
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
                              maximumSignificantDigits={4}
                              minimumFractionDigits={4}
                            />
                          ),
                        },
                      ]}
                      showOverflowMenu
                      overflowButtons={overflowButtons}
                      actionButton={{
                        title: token.type === "lst" ? "Lock" : "Lock & Stake",
                        onClick: () => openLockDialog(token.accountId),
                        disabled:
                          !!stakingPoolId &&
                          token.type === "lst" &&
                          stakingPoolId !== token.accountId,
                      }}
                    />
                  );
                })}
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
