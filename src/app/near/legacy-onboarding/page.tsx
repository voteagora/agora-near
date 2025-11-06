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

export default function LegacyOnboardingPage() {
  const openDialog = useOpenDialog();
  const { signedAccountId, signIn } = useNear();

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
                <div className="text-sm">
                  <span className="text-muted-foreground">Account:</span>{" "}
                  <span className="font-medium">{signedAccountId}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Lockup:</span>{" "}
                  <span className="font-medium">{lockupAccountId ?? "—"}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Staking Pool:</span>{" "}
                  <span className="font-medium">{stakingPoolId ?? "—"}</span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-muted-foreground">Summary:</span>{" "}
                  <span className="font-medium">{statusText}</span>
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
                <p className="text-xs text-muted-foreground">
                  Note: Custom pools must be whitelisted for House of Stake. The
                  UI validates this automatically when entering a custom pool.
                </p>
                <p className="text-xs">
                  Reference:{" "}
                  <a
                    href="https://github.com/voteagora/agora-near/wiki/How-to:-Lock-and-Stake-with-a-Custom-Staking-Pool"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-primary"
                  >
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
