import { useNear } from "@/contexts/NearContext";
import Link from "next/link";
import { memo, useCallback } from "react";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { UpdatedButton } from "../Button";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { Skeleton } from "../ui/skeleton";
import { useDelegateProfile } from "@/hooks/useDelegateProfile";

type AccountActionsProps = {
  close: () => void;
};

export const AccountActions = memo(({ close }: AccountActionsProps) => {
  const { signedAccountId, isInitialized } = useNear();
  const openDialog = useOpenDialog();
  const { data: accountInfo, isLoading: isLoadingVenearAccountInfo } =
    useVenearAccountInfo(signedAccountId);

  const { data: delegate, isLoading: isLoadingDelegateProfile } =
    useDelegateProfile({
      accountId: signedAccountId,
    });

  const hasStatement = !!delegate?.statement;

  const isLoading =
    isLoadingVenearAccountInfo || !isInitialized || isLoadingDelegateProfile;

  const onLockAndStakePress = useCallback(() => {
    close();
    openDialog({
      type: "NEAR_LOCK",
      params: {
        source: accountInfo ? "account_management" : "onboarding",
      },
    });
  }, [accountInfo, close, openDialog]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:px-4">
      <div className="py-2">
        <UpdatedButton
          onClick={onLockAndStakePress}
          className="w-full"
          variant="rounded"
        >
          Lock & Stake
        </UpdatedButton>
      </div>
      <Link
        href={`/delegates/${signedAccountId}`}
        onClick={close}
        className="mt-2 self-stretch h-12 pl-4 text-secondary flex items-center hover:bg-primary/5 hover:font-bold hover:rounded-md"
      >
        View my profile
      </Link>
      <Link
        href={`/delegates/create`}
        onClick={close}
        className="self-stretch h-12 pl-4 text-secondary flex items-center hover:bg-primary/5 hover:font-bold hover:rounded-md"
      >
        {hasStatement ? "Edit delegate statement" : "Create delegate statement"}
      </Link>
    </div>
  );
});

AccountActions.displayName = "AccountActions";
