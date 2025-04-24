"use client";

import { useNear } from "@/contexts/NearContext";
import { DesktopConnectButton } from "./DesktopConnectButton";
import { MobileConnectButton } from "./MobileConnectButton";

export function ConnectButton() {
  const { signedAccountId, signIn, signOut } = useNear();

  return (
    <div>
      <MobileConnectButton
        accountId={signedAccountId}
        isConnected={!!signedAccountId}
        show={signIn}
        signOut={signOut}
      />
      <DesktopConnectButton
        accountId={signedAccountId}
        isConnected={!!signedAccountId}
        show={signIn}
        signOut={signOut}
      />
    </div>
  );
}
