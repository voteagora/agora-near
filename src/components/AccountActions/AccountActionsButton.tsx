import { useCheckVoterStatus } from "@/hooks/useCheckVoterStatus";
import Link from "next/link";
import { memo } from "react";
import { Skeleton } from "../ui/skeleton";
import { RegisterToVoteButton } from "./RegisterToVoteButton";
import { useNear } from "@/contexts/NearContext";

export const AccountActionsButton = memo(() => {
  const { signedAccountId } = useNear();
  const { isRegisteredToVote, isLoading: isLoadingVoterRegistration } =
    useCheckVoterStatus({
      enabled: !!signedAccountId,
    });

  if (!signedAccountId) {
    return null;
  }

  if (isLoadingVoterRegistration) {
    return <Skeleton className="w-full mx-2 h-12 rounded-full" />;
  }

  if (!isRegisteredToVote) {
    return <RegisterToVoteButton />;
  }

  // TODO (AXB-34): Button to create a delegate statement

  return (
    <Link
      href={`/delegates/${signedAccountId}`}
      className="px-5 py-3 rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.03)] border border-neutral-200 flex justify-center"
      onClick={() => close()}
    >
      <span className="text-neutral-900 text-base font-semibold">
        View my profile
      </span>
    </Link>
  );
});

AccountActionsButton.displayName = "AccountActionsButton";
