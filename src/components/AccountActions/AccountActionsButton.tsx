import { useNear } from "@/contexts/NearContext";
import Link from "next/link";
import { memo, useCallback } from "react";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { UpdatedButton } from "../Button";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
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
      <div className="flex flex-col">
        <div className="self-stretch h-12 pl-6 flex items-center animate-pulse bg-tertiary/10 rounded-lg"></div>
        <div className="self-stretch h-12 pl-6 flex items-center animate-pulse bg-tertiary/10 rounded-lg mt-2"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <UpdatedButton
          onClick={onLockAndStakePress}
          className="w-full"
          variant="rounded"
        >
          Lock & Stake
        </UpdatedButton>
      </div>
      <div className="border-b border-line -mx-6 mb-4"></div>
      <Link
        href={`/delegates/${signedAccountId}`}
        onClick={close}
        className="self-stretch h-12 pl-4 text-secondary flex items-center hover:bg-neutral hover:font-bold hover:rounded-md"
      >
        View my profile
      </Link>
      <Link
        href={`/delegates/create`}
        onClick={close}
        className="self-stretch h-12 pl-4 text-secondary flex items-center hover:bg-neutral hover:font-bold hover:rounded-md"
      >
        {hasStatement ? "Edit delegate statement" : "Create delegate statement"}
      </Link>
    </div>
  );
});

AccountActions.displayName = "AccountActions";
