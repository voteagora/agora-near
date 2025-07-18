import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { useMemo } from "react";
import Big from "big.js";

const EncourageDelegationDot = ({ className }: { className?: string }) => {
  const { signedAccountId } = useNear();
  const { data: accountInfo } = useVenearAccountInfo(signedAccountId);

  const shouldShowDot = useMemo(() => {
    if (!accountInfo) return false;

    // Check if user has any tokens (total balance > 0)
    const totalBalance = Big(accountInfo.totalBalance.near || "0").plus(
      accountInfo.totalBalance.extraBalance || "0"
    );

    // Check if user has delegated
    const hasDelegated = !!accountInfo.delegation?.delegatee;

    // Show dot if user has tokens but hasn't delegated
    return totalBalance.gt(0) && !hasDelegated;
  }, [accountInfo]);

  if (!shouldShowDot) return null;

  return (
    <div
      className={`w-[10px] h-[10px] bg-negative rounded-full absolute border border-white ${className || ""}`}
    />
  );
};

export default EncourageDelegationDot;
