import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { useMemo } from "react";
import Big from "big.js";
import { useQueryState } from "nuqs";

const EncourageDelegationDot = ({ className }: { className?: string }) => {
  const { signedAccountId } = useNear();
  const { data: accountInfo } = useVenearAccountInfo(signedAccountId);
  const [filterParam] = useQueryState("filter");

  const shouldShowDot = useMemo(() => {
    if (!accountInfo || !signedAccountId) return false;

    // Don't show dot if already viewing endorsed delegates
    if (filterParam === "endorsed") return false;

    // Check if user has any tokens (total balance > 0)
    const totalBalance = Big(accountInfo.totalBalance.near || "0").plus(
      accountInfo.totalBalance.extraBalance || "0"
    );

    // Check if user has delegated
    const delegatee = accountInfo.delegation?.delegatee;
    const hasDelegated = !!delegatee;
    const isDelegatedToSelf = delegatee === signedAccountId;

    // Show dot if user has tokens and (hasn't delegated OR is delegated to themselves)
    return totalBalance.gt(0) && (!hasDelegated || isDelegatedToSelf);
  }, [accountInfo, signedAccountId, filterParam]);

  if (!shouldShowDot) return null;

  return (
    <div
      className={`w-[10px] h-[10px] bg-negative rounded-full absolute border border-white ${className || ""}`}
    />
  );
};

export default EncourageDelegationDot;
