import { useMemo } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { UpdatedButton } from "@/components/Button";
import { useNear } from "@/contexts/NearContext";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import Big from "big.js";
import Link from "next/link";

export const EncourageDelegationBanner = ({
  filterParam,
}: {
  filterParam: string | null;
}) => {
  const { signedAccountId } = useNear();
  const { data: accountInfo } = useVenearAccountInfo(signedAccountId);

  const shouldShowBanner = useMemo(() => {
    if (!accountInfo || !signedAccountId) return false;

    // Don't show banner if already viewing endorsed delegates
    if (filterParam === "endorsed") return false;

    // Check if user has any tokens (total balance > 0)
    const totalBalance = Big(accountInfo.totalBalance.near || "0").plus(
      accountInfo.totalBalance.extraBalance || "0"
    );

    // Check if user has delegated
    const delegatee = accountInfo.delegation?.delegatee;
    const hasDelegated = !!delegatee;
    const isDelegatedToSelf = delegatee === signedAccountId;

    // Show banner if user has tokens and (hasn't delegated OR is delegated to themselves)
    return totalBalance.gt(0) && (!hasDelegated || isDelegatedToSelf);
  }, [accountInfo, signedAccountId, filterParam]);

  if (!shouldShowBanner || !signedAccountId) {
    return null;
  }

  return (
    <div className="w-full p-4 rounded-lg border border-negative inline-flex justify-start items-start gap-4 mt-3 mb-1">
      <ExclamationCircleIcon className="w-6 h-6 stroke-negative" />
      <div className="flex-1 flex-col justify-start items-start gap-1 text-neutral-900">
        <div className="text-base font-bold leading-normal">
          Your tokens can&#39;t be voted with!
        </div>
        <div className="text-sm font-medium leading-[21px]">
          Make your vote count by delegating to trusted community members.
        </div>
      </div>
      <Link href="/delegates?filter=endorsed">
        <UpdatedButton
          type="primary"
          className="font-medium px-[20px] py-3 h-full"
        >
          View endorsed delegates
        </UpdatedButton>
      </Link>
    </div>
  );
};
