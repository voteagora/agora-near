"use client";

import walletIcon from "@/icons/wallet.svg";
import Image from "next/image";
import { MobileProfileDropDown } from "./MobileProfileDropDown";

type MobileConnectButtonProps = {
  accountId?: string;
  isConnected: boolean;
  show: () => void;
  signOut: () => void;
};

export function MobileConnectButton({
  accountId,
  isConnected,
  show,
  signOut,
}: MobileConnectButtonProps) {
  return (
    <div className="sm:hidden flex items-center opacity-100 transition-all active:opacity-60 ">
      {isConnected ? (
        <MobileProfileDropDown accountId={accountId} signOut={signOut} />
      ) : (
        <div onClick={show}>
          <Image
            height={walletIcon.height}
            width={walletIcon.width}
            src={walletIcon.src}
            alt="Wallet"
          />
        </div>
      )}
    </div>
  );
}
