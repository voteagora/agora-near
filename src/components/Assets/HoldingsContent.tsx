import { memo } from "react";
import { LockupHoldings } from "./LockupHoldings";
import { WalletHoldings } from "./WalletHoldings";
import StakeEncouragementBanner from "./StakeEncouragementBanner";

interface HoldingsContentProps {
  openLockDialog: (preSelectedTokenId?: string | null) => void;
  openStakingDialog: () => void;
  openUnstakeDialog: () => void;
}

export const HoldingsContent = memo(
  ({
    openLockDialog,
    openStakingDialog,
    openUnstakeDialog,
  }: HoldingsContentProps) => {
    return (
      <div className="w-full">
        <StakeEncouragementBanner onStakeClick={openStakingDialog} />
        <table className="w-full">
          <tbody>
            <LockupHoldings
              openLockDialog={openLockDialog}
              openStakingDialog={openStakingDialog}
              openUnstakeDialog={openUnstakeDialog}
            />
            <WalletHoldings openLockDialog={openLockDialog} />
          </tbody>
        </table>
      </div>
    );
  }
);

HoldingsContent.displayName = "HoldingsContent";
