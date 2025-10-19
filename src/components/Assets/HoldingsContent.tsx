import { memo } from "react";
import { LockupHoldings } from "./LockupHoldings";
import { WalletHoldings } from "./WalletHoldings";

interface HoldingsContentProps {
  openLockDialog: (preSelectedTokenId?: string | null) => void;
  openStakingDialog: () => void;
}

export const HoldingsContent = memo(
  ({ openLockDialog, openStakingDialog }: HoldingsContentProps) => {
    return (
      <table className="w-full">
        <tbody>
          <LockupHoldings
            openLockDialog={openLockDialog}
            openStakingDialog={openStakingDialog}
          />
          <WalletHoldings openLockDialog={openLockDialog} />
        </tbody>
      </table>
    );
  }
);

HoldingsContent.displayName = "HoldingsContent";
