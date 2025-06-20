import { memo, useCallback } from "react";
import {
  LINEAR_TOKEN_CONTRACTS,
  STNEAR_TOKEN_CONTRACTS,
} from "@/lib/constants";
import { useNear } from "@/contexts/NearContext";
import { TokenWithBalance } from "@/lib/types";
import NearTokenAmount from "../shared/NearTokenAmount";
import { AssetRow } from "./AssetRow";

interface AvailableTokenRowProps {
  token: TokenWithBalance;
  stakingPoolId?: string;
  onLockDialog: (tokenAccountId?: string) => void;
}

export const AvailableTokenRow = memo<AvailableTokenRowProps>(
  ({ token, stakingPoolId, onLockDialog }) => {
    const { networkId } = useNear();

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

    const handleLockDialog = useCallback(
      (tokenAccountId?: string) => {
        onLockDialog(tokenAccountId);
      },
      [onLockDialog]
    );

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
          onClick: () => handleLockDialog(token.accountId),
          disabled:
            !!stakingPoolId &&
            token.type === "lst" &&
            stakingPoolId !== token.accountId,
        }}
      />
    );
  }
);

AvailableTokenRow.displayName = "AvailableTokenRow";
