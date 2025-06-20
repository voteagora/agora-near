import { memo, useCallback, useMemo } from "react";
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
  stakingPoolId?: string | null;
  onLockClick: (tokenAccountId?: string) => void;
}

export const AvailableTokenRow = memo<AvailableTokenRowProps>(
  ({ token, stakingPoolId, onLockClick }) => {
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

    const handleLockClick = useCallback(
      (tokenAccountId?: string) => {
        onLockClick(tokenAccountId);
      },
      [onLockClick]
    );

    const overflowButtons = useMemo(() => {
      const buttons = [];

      // Add "Manage staking" button for LST tokens
      if (token.type === "lst") {
        buttons.push({
          title: "Manage staking",
          onClick: () => handleManageStaking(token.accountId ?? ""),
          showExternalIcon: true,
        });
      }

      return buttons;
    }, [token.type, token.accountId, handleManageStaking]);

    const actionButton = useMemo(
      () => ({
        title: token.type === "lst" ? "Lock" : "Lock & Stake",
        onClick: () => handleLockClick(token.accountId),
        disabled:
          !!stakingPoolId &&
          token.type === "lst" &&
          stakingPoolId !== token.accountId,
      }),
      [token.type, token.accountId, stakingPoolId, handleLockClick]
    );

    const columns = useMemo(
      () => [
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
      ],
      [token.balance, token.metadata?.symbol]
    );

    return (
      <AssetRow
        metadata={token.metadata}
        columns={columns}
        showOverflowMenu
        overflowButtons={overflowButtons}
        actionButton={actionButton}
      />
    );
  }
);

AvailableTokenRow.displayName = "AvailableTokenRow";
