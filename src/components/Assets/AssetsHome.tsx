"use client";

import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { UpdatedButton } from "../Button";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { useNear } from "@/contexts/NearContext";
import AgoraLoader from "../shared/AgoraLoader/AgoraLoader";

export const AssetsHome = () => {
  const openDialog = useOpenDialog();
  const { signedAccountId } = useNear();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useVenearAccountInfo(signedAccountId);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="mt-12">
        {isLoadingAccount ? (
          <AgoraLoader />
        ) : (
          <UpdatedButton
            onClick={() => {
              openDialog({
                type: "NEAR_LOCK",
                params: {
                  source: accountInfo ? "account_management" : "onboarding",
                },
              });
            }}
          >
            Stake & Lock
          </UpdatedButton>
        )}
      </div>
    </div>
  );
};
