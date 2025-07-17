import { DesktopProfileDropDown } from "./DesktopProfileDropDown";
import { ArrowRight } from "@/icons/ArrowRight";

type DesktopConnectButtonProps = {
  isConnected: boolean;
  show: () => void;
  accountId?: string;
  signOut: () => void;
};

export function DesktopConnectButton({
  isConnected,
  show,
  accountId,
  signOut,
}: DesktopConnectButtonProps) {
  return (
    <div
      onClick={!isConnected ? () => show?.() : undefined}
      className="border border-line text-primary font-medium bg-wash py-2 px-4 rounded-full cursor-pointer hidden sm:flex items-center transition-all hover:shadow-newDefault h-[48px]"
    >
      {isConnected ? (
        <DesktopProfileDropDown accountId={accountId} signOut={signOut} />
      ) : (
        <>
          Connect{"\u00A0"}Wallet
          <ArrowRight className="ml-3 mr-1 stroke-primary" />
        </>
      )}
    </div>
  );
}
