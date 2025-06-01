import { useNear } from "@/contexts/NearContext";
import { useCheckVoterStatus } from "@/hooks/useCheckVoterStatus";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { UpdatedButton } from "../Button";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { Skeleton } from "../ui/skeleton";
import { RegisterToVoteButton } from "./RegisterToVoteButton";

export const AccountActionsButton = memo(() => {
  const { signedAccountId } = useNear();
  const { isRegisteredToVote, isLoading: isLoadingVoterRegistration } =
    useCheckVoterStatus({
      enabled: !!signedAccountId,
    });
  const openDialog = useOpenDialog();

  const handleOpenLockDialog = () => {
    openDialog({
      type: "NEAR_LOCK",
      params: {
        source: "account_management",
      },
    });
  };

  const route = useRouter();

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
    <div className="flex flex-col gap-2">
      <UpdatedButton
        type="secondary"
        className="w-full"
        onClick={() => route.push(`/delegates/${signedAccountId}`)}
      >
        View my profile
      </UpdatedButton>
      <UpdatedButton
        type="secondary"
        className="w-full"
        onClick={handleOpenLockDialog}
      >
        Lock NEAR
      </UpdatedButton>
    </div>
  );
});

AccountActionsButton.displayName = "AccountActionsButton";
