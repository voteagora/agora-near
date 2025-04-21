"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNear } from "@/contexts/NearContext";
import { useLockNear } from "@/hooks/useLockNear";
import { useRegisterLockup } from "@/hooks/useRegisterLockup";
import { useStakeNear } from "@/hooks/useStakeNear";
import { useAccountInfo, useVeNearContractInfo } from "@/lib/near/veNear";
import { utils } from "near-api-js";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";

export default function VeNearInfoClient() {
  const { signedAccountId } = useNear();
  const { data: contractInfo, isLoading: isLoadingContractInfo } =
    useVeNearContractInfo();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useAccountInfo(signedAccountId);

  const {
    registerAndDeployLockup,
    isPending: isLoadingRegistration,
    error: venearContractError,
  } = useRegisterLockup();

  const {
    lockNear,
    unlockNear,
    isLockingNear,
    isUnlockingNear,
    lockingNearError,
    unlockingNearError,
  } = useLockNear();

  const { stakeNear, isStakingNear, stakingNearError } = useStakeNear({
    lockupAccountId: accountInfo?.lockupAccountId || "",
  });

  const [stakeAmount, setStakeAmount] = useState("");

  const lockAllNear = useCallback(() => {
    if (accountInfo?.lockupAccountId) {
      lockNear(accountInfo.lockupAccountId);
    }
  }, [accountInfo?.lockupAccountId, lockNear]);

  const unlockAllNear = useCallback(() => {
    if (accountInfo?.lockupAccountId) {
      unlockNear({
        lockupAccountId: accountInfo.lockupAccountId,
      });
    }
  }, [accountInfo?.lockupAccountId, unlockNear]);

  const onRegisterToVote = useCallback(() => {
    registerAndDeployLockup(
      contractInfo?.storageDepositAmount || "0",
      contractInfo?.lockupDeploymentCost || "0"
    );
  }, [
    contractInfo?.lockupDeploymentCost,
    contractInfo?.storageDepositAmount,
    registerAndDeployLockup,
  ]);

  const handleStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setStakeAmount(value);
    }
  };

  const handleStake = () => {
    if (!stakeAmount) return;
    try {
      const yoctoAmount = utils.format.parseNearAmount(stakeAmount);
      if (!yoctoAmount) throw new Error("Invalid amount");
      stakeNear(yoctoAmount, "chorusone.pool.f863973.m0");
    } catch (error) {
      console.error("Error converting stake amount:", error);
    }
  };

  const renderContractInfo = () => (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>veNEAR Contract Information</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingContractInfo ? (
          <LoadingState />
        ) : (
          <div className="space-y-4">
            <InfoItem
              label="Total veNEAR Supply"
              value={utils.format.formatNearAmount(
                contractInfo?.totalSupply || "0"
              )}
              unit="veNEAR"
            />
            <Separator />
            <InfoItem
              label="Lockup Deployment Cost"
              value={utils.format.formatNearAmount(
                contractInfo?.lockupDeploymentCost || "0"
              )}
              unit="NEAR"
            />
            <Separator />
            <InfoItem
              label="Minimum Account Deposit"
              value={utils.format.formatNearAmount(
                contractInfo?.storageDepositAmount || "0"
              )}
              unit="NEAR"
            />
            <Separator />
            <InfoItem
              label="Staking Pool Whitelist Contract ID"
              value={contractInfo?.stakingPoolWhitelistId || "N/A"}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAccountInfo = () => (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Your veNEAR Account</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingAccount ? (
          <LoadingState />
        ) : accountInfo ? (
          <div className="space-y-4">
            {accountInfo.lockupAccountId && (
              <InfoItem
                label="Lockup Account ID"
                value={accountInfo.lockupAccountId}
              />
            )}
            <Separator />
            <InfoItem
              label="veNEAR Total Balance"
              value={utils.format.formatNearAmount(
                accountInfo.veNearBalance || "0"
              )}
              unit="veNEAR"
            />
            <InfoItem
              label="Principal Balance"
              value={utils.format.formatNearAmount(
                accountInfo.totalBalance.near
              )}
              unit="veNEAR"
            />
            <InfoItem
              label="Earned veNEAR"
              value={utils.format.formatNearAmount(
                accountInfo.totalBalance.extraBalance
              )}
              unit="veNEAR"
            />
            {/* <InfoItem
              label="Liquid owners balance"
              value={utils.format.formatNearAmount(
                accountInfo.liquidBalance || "0"
              )}
              unit="NEAR"
            />
            <InfoItem
              label="Owners balance"
              value={utils.format.formatNearAmount(
                accountInfo.ownersBalance || "0"
              )}
              unit="NEAR"
            /> */}
            <Separator />
            <InfoItem
              label="Delegated NEAR Balance"
              value={utils.format.formatNearAmount(
                accountInfo.delegatedBalance.near
              )}
              unit="NEAR"
            />
            <InfoItem
              label="Delegated Rewards Balance"
              value={utils.format.formatNearAmount(
                accountInfo.delegatedBalance.extraBalance
              )}
              unit="NEAR"
            />
            {accountInfo.delegation && (
              <>
                <Separator />
                <InfoItem
                  label="Delegated To"
                  value={accountInfo.delegation.delegatee}
                />
              </>
            )}
            {accountInfo.stakingPool && (
              <>
                <Separator />
                <InfoItem
                  label="Selected Staking Pool"
                  value={accountInfo.stakingPool}
                />
              </>
            )}
            {accountInfo.veNearLiquidBalance && (
              <>
                <Separator />
                <InfoItem
                  label="Liquid NEAR Balance (NEAR not locked + staked NEAR)"
                  value={utils.format.formatNearAmount(
                    accountInfo.veNearLiquidBalance
                  )}
                  unit="NEAR"
                />
              </>
            )}
            {accountInfo.veNearPendingBalance && (
              <>
                <Separator />
                <InfoItem
                  label="veNEAR Pending Balance"
                  value={utils.format.formatNearAmount(
                    accountInfo.veNearPendingBalance
                  )}
                  unit="veNEAR"
                />
              </>
            )}
            {accountInfo.veNearLockedBalance && (
              <>
                <Separator />
                <InfoItem
                  label="veNEAR Locked Balance"
                  value={utils.format.formatNearAmount(
                    accountInfo.veNearLockedBalance
                  )}
                  unit="veNEAR"
                />
              </>
            )}
            {accountInfo.veNearUnlockTimestamp && (
              <>
                <Separator />
                <InfoItem
                  label="Time until veNEAR is unlocked"
                  value={String(
                    Math.max(
                      0,
                      parseFloat(accountInfo.veNearUnlockTimestamp || "0") /
                        1e6 -
                        new Date().getTime()
                    )
                  )}
                  isRaw
                />
              </>
            )}
            <Separator />
            <div className="flex flex-col gap-2">
              <CardTitle>Account actions</CardTitle>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-2">
                  <Button
                    loading={isLockingNear}
                    onClick={lockAllNear}
                    disabled={isUnlockingNear}
                  >
                    {`Lock all NEAR`}
                  </Button>
                  {lockingNearError && (
                    <p className="text-red-500">{`Lock error: ${lockingNearError.message}`}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    loading={isUnlockingNear}
                    onClick={unlockAllNear}
                    disabled={isLockingNear}
                  >
                    {`Unlock all veNEAR`}
                  </Button>
                  {unlockingNearError && (
                    <p className="text-red-500">{`Unlock error: ${unlockingNearError.message}`}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Amount to stake"
                      value={stakeAmount}
                      onChange={handleStakeAmountChange}
                      className="w-42"
                    />
                    <Button
                      loading={isStakingNear}
                      onClick={handleStake}
                      disabled={isStakingNear || !stakeAmount}
                    >
                      {`Stake NEAR`}
                    </Button>
                  </div>
                  {stakingNearError && (
                    <p className="text-red-500">{`Stake error: ${stakingNearError.message}`}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>Please register your account to vote</p>
            <Button loading={isLoadingRegistration} onClick={onRegisterToVote}>
              Register to vote
            </Button>
            {venearContractError && (
              <p className="text-red-500">{`Registration error: ${venearContractError.message}`}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderContractInfo()}
      {renderAccountInfo()}
    </div>
  );
}

const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
  </div>
);

interface InfoItemProps {
  label: string;
  value: string;
  unit?: string;
  isRaw?: boolean;
}

const InfoItem = ({ label, value, unit, isRaw }: InfoItemProps) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-lg font-medium">
      {isRaw ? value : `${value}${unit ? ` ${unit}` : ""}`}
    </p>
  </div>
);
