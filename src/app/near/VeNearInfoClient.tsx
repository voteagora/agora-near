"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNear } from "@/contexts/NearContext";
import { useAccountInfo, useVeNearContractInfo } from "@/lib/near/veNear";
import { utils } from "near-api-js";

export default function VeNearInfoClient() {
  const { signedAccountId } = useNear();
  const { data: contractInfo, isLoading: isLoadingContractInfo } =
    useVeNearContractInfo();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useAccountInfo(signedAccountId);

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
            <Separator />
            <InfoItem
              label="NEAR Balance"
              value={utils.format.formatNearAmount(
                accountInfo.totalBalance.near
              )}
              unit="NEAR"
            />
            <InfoItem
              label="Rewards Balance"
              value={utils.format.formatNearAmount(
                accountInfo.totalBalance.extraBalance
              )}
              unit="NEAR"
            />
            {/* <InfoItem
              label="Liquid NEAR Balance"
              value={utils.format.formatNearAmount(
                accountInfo.liquidBalance || "0"
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
                  label="Liquid NEAR Balance"
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
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Connect your NEAR wallet to view your veNEAR account information
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
