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

export default function VeNearDebugCards() {
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
  } = useLockNear({
    lockupAccountId: accountInfo?.lockupAccountId || "",
  });

  const {
    stakeNear,
    unstakeNear,
    withdrawNear,
    knownDepositedBalance,
    isStakingNear,
    isUnstakingNear,
    isWithdrawingNear,
    stakingNearError,
    unstakingNearError,
    withdrawingNearError,
  } = useStakeNear({
    lockupAccountId: accountInfo?.lockupAccountId || "",
  });

  const [stakeAmount, setStakeAmount] = useState("");
  const [lockAmount, setLockAmount] = useState("");
  const [unlockAmount, setUnlockAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const lockAllNear = useCallback(() => {
    if (accountInfo?.lockupAccountId) {
      lockNear({});
    }
  }, [accountInfo?.lockupAccountId, lockNear]);

  const unlockAllNear = useCallback(() => {
    if (accountInfo?.lockupAccountId) {
      unlockNear({});
    }
  }, [accountInfo?.lockupAccountId, unlockNear]);

  const handleLockAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setLockAmount(value);
    }
  };

  const handleUnlockAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUnlockAmount(value);
    }
  };

  const handleLockSpecificAmount = () => {
    if (!lockAmount || !accountInfo?.lockupAccountId) return;
    try {
      const yoctoAmount = utils.format.parseNearAmount(lockAmount);
      if (!yoctoAmount) throw new Error("Invalid amount");
      lockNear({ amount: yoctoAmount });
    } catch (error) {
      console.error("Error converting lock amount:", error);
    }
  };

  const handleUnlockSpecificAmount = () => {
    if (!unlockAmount || !accountInfo?.lockupAccountId) return;
    try {
      const yoctoAmount = utils.format.parseNearAmount(unlockAmount);
      if (!yoctoAmount) throw new Error("Invalid amount");
      unlockNear({ amount: yoctoAmount });
    } catch (error) {
      console.error("Error converting unlock amount:", error);
    }
  };

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
      stakeNear(yoctoAmount, accountInfo?.stakingPool);
    } catch (error) {
      console.error("Error converting stake amount:", error);
    }
  };

  const handleUnstakeAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUnstakeAmount(value);
    }
  };

  const handleUnstake = () => {
    if (!unstakeAmount) return;
    try {
      const yoctoAmount = utils.format.parseNearAmount(unstakeAmount);
      if (!yoctoAmount) throw new Error("Invalid amount");
      unstakeNear(yoctoAmount);
    } catch (error) {
      console.error("Error converting unstake amount:", error);
    }
  };

  const handleWithdrawAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setWithdrawAmount(value);
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    try {
      const yoctoAmount = utils.format.parseNearAmount(withdrawAmount);
      if (!yoctoAmount) throw new Error("Invalid amount");
      withdrawNear(yoctoAmount);
    } catch (error) {
      console.error("Error converting withdraw amount:", error);
    }
  };

  const renderContractInfo = () => (
    <Card className="flex flex-col grow">
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
              label="Lockup Storage Cost"
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
    <Card className="flex flex-col grow">
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
              label="veNEAR Total Balance (Principal + Earned)"
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

            <Separator />
            <CardTitle>Delegation</CardTitle>
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
            <Separator />
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

  const renderLockUnlockActions = () => {
    if (!accountInfo) return null;
    return (
      <Card className="flex flex-col grow">
        <CardHeader>
          <CardTitle>Lock/unlock NEAR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col gap-3 p-4 border rounded-lg">
                <h3 className="font-semibold">Lock NEAR</h3>
                {accountInfo.veNearLiquidBalance && (
                  <InfoItem
                    label="Available to lock"
                    value={utils.format.formatNearAmount(
                      accountInfo.veNearLiquidBalance
                    )}
                    unit="NEAR"
                  />
                )}

                {accountInfo.veNearLockedBalance && (
                  <InfoItem
                    label="veNEAR Locked Balance"
                    value={utils.format.formatNearAmount(
                      accountInfo.veNearLockedBalance
                    )}
                    unit="veNEAR"
                  />
                )}
                <Input
                  type="text"
                  placeholder="Amount to lock"
                  value={lockAmount}
                  onChange={handleLockAmountChange}
                  className="w-full"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    loading={isLockingNear}
                    onClick={handleLockSpecificAmount}
                    disabled={isLockingNear || !lockAmount}
                    className="w-full"
                  >
                    Lock Amount
                  </Button>
                  <Button
                    loading={isLockingNear}
                    onClick={lockAllNear}
                    disabled={isLockingNear}
                    variant="outline"
                    className="w-full"
                  >
                    Lock All
                  </Button>
                </div>
                {lockingNearError && (
                  <p className="text-red-500 text-sm">{`Error: ${lockingNearError.message}`}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 p-4 border rounded-lg">
                <h3 className="font-semibold">Unlock veNEAR</h3>
                {accountInfo.veNearPendingBalance && (
                  <InfoItem
                    label="Pending to unlock"
                    value={utils.format.formatNearAmount(
                      accountInfo.veNearPendingBalance
                    )}
                    unit="veNEAR"
                  />
                )}
                {accountInfo.veNearUnlockTimestamp && (
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
                )}
                <Input
                  type="text"
                  placeholder="Amount to unlock"
                  value={unlockAmount}
                  onChange={handleUnlockAmountChange}
                  className="w-full"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    loading={isUnlockingNear}
                    onClick={handleUnlockSpecificAmount}
                    disabled={isUnlockingNear || !unlockAmount}
                    className="w-full"
                  >
                    Unlock Amount
                  </Button>
                  <Button
                    loading={isUnlockingNear}
                    onClick={unlockAllNear}
                    disabled={isUnlockingNear}
                    variant="outline"
                    className="w-full"
                  >
                    Unlock All
                  </Button>
                </div>
                {unlockingNearError && (
                  <p className="text-red-500 text-sm">{`Error: ${unlockingNearError.message}`}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStakeActions = () => {
    if (!accountInfo) return null;
    return (
      <Card className="flex flex-col grow">
        <CardHeader>
          <CardTitle>Stake/unstake NEAR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col gap-3 p-4 border rounded-lg">
                <h3 className="font-semibold">Stake NEAR</h3>
                <InfoItem
                  label="Available to stake balance"
                  value={utils.format.formatNearAmount(
                    accountInfo.liquidBalance || "0"
                  )}
                  unit="NEAR"
                />
                {accountInfo.stakingPool && (
                  <>
                    <InfoItem
                      label="Selected Staking Pool"
                      value={accountInfo.stakingPool}
                    />
                  </>
                )}
                <Input
                  type="text"
                  placeholder="Amount to stake"
                  value={stakeAmount}
                  onChange={handleStakeAmountChange}
                  className="w-full"
                />
                <Button
                  loading={isStakingNear}
                  onClick={handleStake}
                  disabled={isStakingNear || !stakeAmount}
                  className="w-full"
                >
                  Stake NEAR
                </Button>
                {stakingNearError && (
                  <p className="text-red-500 text-sm">{`Error: ${stakingNearError.message}`}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4 border rounded-lg">
                <h3 className="font-semibold">Unstake NEAR</h3>
                <InfoItem
                  label="Known deposited balance"
                  value={utils.format.formatNearAmount(
                    knownDepositedBalance || "0"
                  )}
                  unit="NEAR"
                />
                <Input
                  type="text"
                  placeholder="Amount to unstake"
                  value={unstakeAmount}
                  onChange={handleUnstakeAmountChange}
                  className="w-full"
                />
                <Button
                  loading={isUnstakingNear}
                  onClick={handleUnstake}
                  disabled={isUnstakingNear || !unstakeAmount}
                  className="w-full"
                >
                  Unstake NEAR
                </Button>
                {unstakingNearError && (
                  <p className="text-red-500 text-sm">{`Error: ${unstakingNearError.message}`}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4 border rounded-lg">
                <h3 className="font-semibold">Withdraw Unstaked NEAR</h3>
                <Input
                  type="text"
                  placeholder="Amount to withdraw"
                  value={withdrawAmount}
                  onChange={handleWithdrawAmountChange}
                  className="w-full"
                />
                <Button
                  loading={isWithdrawingNear}
                  onClick={handleWithdraw}
                  disabled={isWithdrawingNear || !withdrawAmount}
                  className="w-full"
                >
                  Withdraw NEAR
                </Button>
                {withdrawingNearError && (
                  <p className="text-red-500 text-sm">{`Error: ${withdrawingNearError.message}`}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {renderContractInfo()}
      {renderAccountInfo()}
      {renderLockUnlockActions()}
      {renderStakeActions()}
    </>
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
