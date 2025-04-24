import { DesktopProfileDropDown } from "./DesktopProfileDropDown";

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
      className="border border-line text-primary font-medium bg-neutral py-2 px-4 rounded-full cursor-pointer hidden sm:flex items-center transition-all hover:shadow-newDefault"
    >
      {isConnected ? (
        <DesktopProfileDropDown accountId={accountId} signOut={signOut} />
      ) : (
        "Connect Wallet"
      )}
    </div>
  );
}
