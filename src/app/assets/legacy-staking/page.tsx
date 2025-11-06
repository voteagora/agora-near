"use client";

import { useState, useMemo, useCallback } from "react";
import { useNear } from "@/contexts/NearContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useRefreshStakingPoolBalance } from "@/hooks/useRefreshStakingPoolBalance";
import CopyableHumanAddress from "@/components/shared/CopyableHumanAddress";
import { ExternalLink, Github } from "lucide-react";

export default function LegacyOnboardingPage() {
  const openDialog = useOpenDialog();
  const { signedAccountId, signIn, networkId } = useNear();
  const nearblocksBase =
    networkId === "testnet"
      ? "https://testnet.nearblocks.io"
      : "https://nearblocks.io";

  const { lockupAccountId, isLoading: isLoadingLockup } = useLockupAccount();

  const { stakingPoolId, isLoadingStakingPoolId: isLoadingPool } =
    useCurrentStakingPoolId({
      lockupAccountId: lockupAccountId ?? "",
      enabled: !!lockupAccountId,
    });

  const { refreshStakingPoolBalanceAsync, error: refreshError } =
    useRefreshStakingPoolBalance({
      lockupAccountId: lockupAccountId ?? "",
    });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onOpenStakingDialog = useCallback(() => {
    console.log("[LegacyOnboarding] Open Staking dialog clicked", {
      signedAccountId,
      lockupAccountId,
      stakingPoolId,
    });
    openDialog({
      type: "NEAR_STAKING",
      className: "sm:w-[500px]",
      params: {
        source: "account_management",
      },
    });
    console.log("[LegacyOnboarding] Staking dialog opened");
  }, [openDialog, signedAccountId, lockupAccountId, stakingPoolId]);

  const onOpenLockDialog = useCallback(() => {
    console.log("[LegacyOnboarding] Open Lock dialog clicked", {
      signedAccountId,
      lockupAccountId,
    });
    openDialog({
      type: "NEAR_LOCK",
      className: "sm:w-[500px]",
      params: {
        source: "account_management",
      },
    });
    console.log("[LegacyOnboarding] Lock dialog opened");
  }, [openDialog, signedAccountId, lockupAccountId]);

  const onOpenUnlockDialog = useCallback(() => {
    console.log("[LegacyOnboarding] Open Unlock dialog clicked", {
      signedAccountId,
      lockupAccountId,
    });
    openDialog({
      type: "NEAR_UNLOCK",
      params: {},
    });
    console.log("[LegacyOnboarding] Unlock dialog opened");
  }, [openDialog, signedAccountId, lockupAccountId]);

  const onRefresh = useCallback(async () => {
    console.log("[LegacyOnboarding] Refresh balance clicked", {
      lockupAccountId,
    });
    if (!lockupAccountId) {
      console.warn(
        "[LegacyOnboarding] Refresh balance aborted: no lockupAccountId"
      );
      return;
    }
    setIsRefreshing(true);
    try {
      console.log("[LegacyOnboarding] Calling refresh_staking_pool_balance");
      await refreshStakingPoolBalanceAsync();
      console.log("[LegacyOnboarding] Refresh balance completed");
    } catch (e) {
      console.error("[LegacyOnboarding] Refresh balance error", e);
      throw e;
    } finally {
      setIsRefreshing(false);
      console.log("[LegacyOnboarding] Refresh balance end");
    }
  }, [lockupAccountId, refreshStakingPoolBalanceAsync]);

  const statusText = useMemo(() => {
    if (!signedAccountId) return "Not connected";
    if (isLoadingLockup || isLoadingPool) return "Loading...";
    if (!lockupAccountId) return "No lockup detected";
    if (stakingPoolId) return `Lockup set · Pool: ${stakingPoolId}`;
    return "Lockup set · No pool selected";
  }, [
    signedAccountId,
    lockupAccountId,
    stakingPoolId,
    isLoadingLockup,
    isLoadingPool,
  ]);

  return (
    <div className="flex min-h-screen flex-col px-4 md:px-8 py-6 gap-6">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Legacy Onboarding: Custom Staked Tokens
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage existing staking positions from a custom pool and bring them
            into House of Stake with a guided UI.
          </p>
        </div>

        {!signedAccountId ? (
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Connect your NEAR Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                You need to connect your wallet to continue.
              </p>
              <Button onClick={signIn} className="w-48">
                Connect NEAR Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Account:</span>
                  <CopyableHumanAddress
                    address={signedAccountId}
                    shouldTruncate={false}
                  />
                  <a
                    href={`${nearblocksBase}/address/${signedAccountId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-md border px-1.5 py-0.5 text-xs text-primary hover:bg-muted"
                    aria-label="View account on NearBlocks"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Lockup:</span>
                  {lockupAccountId ? (
                    <>
                      <CopyableHumanAddress
                        address={lockupAccountId}
                        shouldTruncate={false}
                      />
                      <a
                        href={`${nearblocksBase}/address/${lockupAccountId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md border px-1.5 py-0.5 text-xs text-primary hover:bg-muted"
                        aria-label="View lockup on NearBlocks"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </>
                  ) : (
                    <span className="font-medium">—</span>
                  )}
                </div>
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Staking Pool:</span>
                  {stakingPoolId ? (
                    <>
                      <CopyableHumanAddress
                        address={stakingPoolId}
                        shouldTruncate={false}
                      />
                      <a
                        href={`${nearblocksBase}/address/${stakingPoolId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md border px-1.5 py-0.5 text-xs text-primary hover:bg-muted"
                        aria-label="View staking pool on NearBlocks"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </>
                  ) : (
                    <span className="font-medium">—</span>
                  )}
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-muted-foreground">Summary:</span>{" "}
                  <span className="font-medium">{statusText}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {signedAccountId ? (
                      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Wallet connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                        Not connected
                      </span>
                    )}
                    {isLoadingLockup ? (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                        Lockup loading
                      </span>
                    ) : lockupAccountId ? (
                      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Lockup set
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        No lockup
                      </span>
                    )}
                    {isLoadingPool ? (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                        Pool loading
                      </span>
                    ) : stakingPoolId ? (
                      <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                        Pool selected
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                        No pool selected
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Guided steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <ol className="list-decimal list-inside space-y-3 text-sm">
                  <li>
                    Open the Staking dialog to manage your underlying pool: -
                    use Advanced → Unstake all when you’re ready to exit the
                    legacy pool.
                  </li>
                  <li>
                    After the pool’s cooldown period, use Advanced → Withdraw
                    all to bring tokens back to the lockup.
                  </li>
                  <li>
                    Click Refresh balance to sync and surface any available
                    rewards or withdrawal balance in your lockup.
                  </li>
                  <li>
                    Once your deposited amount in the pool is 0, use Advanced →
                    Unselect staking pool. This lets you choose a different
                    pool.
                  </li>
                  <li>
                    Use the Staking dialog to select your preferred pool (custom
                    supported if whitelisted) and stake through your lockup.
                  </li>
                  <li>
                    Optional: use the Lock / Unlock dialogs to manage your
                    voting power (veNEAR) directly.
                  </li>
                </ol>
                <div className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium leading-none text-amber-700 bg-amber-50 border-amber-200">
                  Note: Custom pools must be whitelisted for House of Stake. The
                  UI validates this automatically when entering a custom pool.
                </div>
                <p className="text-xs flex items-center gap-2">
                  Reference:{" "}
                  <a
                    href="https://github.com/voteagora/agora-near/wiki/How-to:-Lock-and-Stake-with-a-Custom-Staking-Pool"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium leading-none text-gray-700 hover:bg-muted whitespace-nowrap"
                  >
                    <Github className="h-3 w-3 relative top-px" />
                    Lock and Stake with a Custom Staking Pool
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onOpenStakingDialog}
                  className="w-full sm:w-auto"
                >
                  Open Staking dialog
                </Button>
                <Button
                  onClick={onRefresh}
                  disabled={!lockupAccountId || isRefreshing}
                  variant="secondary"
                  className="w-full sm:w-auto text-white"
                >
                  {isRefreshing ? "Refreshing..." : "Refresh balance"}
                </Button>
                <Button
                  onClick={onOpenLockDialog}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Open Lock dialog
                </Button>
                <Button
                  onClick={onOpenUnlockDialog}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Open Unlock dialog
                </Button>
              </CardContent>
              {refreshError && (
                <div className="px-6 pb-4 text-xs text-red-500">
                  {refreshError.message}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
