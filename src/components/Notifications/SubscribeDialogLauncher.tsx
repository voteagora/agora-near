"use client";

import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { useNear } from "@/contexts/NearContext";
import { useDelegateProfile } from "@/hooks/useDelegateProfile";
import { useEffect } from "react";

const SubscribeDialogLauncher = () => {
  const openDialog = useOpenDialog();
  const { signedAccountId } = useNear();
  const { data: delegate } = useDelegateProfile({
    accountId: signedAccountId,
  });

  useEffect(() => {
    if (!signedAccountId || !delegate) return;

    const hasPrompted = localStorage.getItem("agora-email-subscriptions--root");

    const waitingToPrompt =
      delegate.notificationPreferences?.wants_proposal_created_email ===
        "prompt" ||
      delegate.notificationPreferences?.wants_proposal_ending_soon_email ===
        "prompt";

    if (!hasPrompted && waitingToPrompt) {
      setTimeout(() => {
        openDialog({
          type: "NEAR_SUBSCRIBE",
          params: { type: "root" },
        });
      }, 3000);
    }
  }, [signedAccountId, delegate, openDialog]);

  return null;
};

export default SubscribeDialogLauncher;
