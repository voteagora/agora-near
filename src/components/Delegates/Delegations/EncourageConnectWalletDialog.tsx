import { UpdatedButton } from "@/components/Button";
import { useNear } from "@/contexts/NearContext";
import { useEffect } from "react";

export const EncourageConnectWalletDialog = ({
  closeDialog,
}: {
  closeDialog: () => void;
}) => {
  const { signedAccountId, signIn } = useNear();

  useEffect(() => {
    if (signedAccountId) {
      closeDialog();
    }
  }, [signedAccountId, closeDialog]);

  return (
    <div className="flex flex-col gap-7 justify-center ">
      <div>
        <div className="text-neutral-900 text-2xl font-bold leading-loose">
          Governance starts with you!
        </div>
        <div className="justify-start text-neutral-700 text-base font-medium leading-normal">
          Your tokens matter— connect your wallet to delegate your voting power
          and shape the future of the NEAR ecosystem.
        </div>
      </div>
      <UpdatedButton
        type="primary"
        className="w-full px-[20px] py-3 font-medium text-[16px] leading-[24px]"
        onClick={() => {
          signIn();
          closeDialog();
        }}
      >
        Connect wallet
      </UpdatedButton>
    </div>
  );
};
