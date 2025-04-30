import { DelegateChunk } from "@/app/api/common/delegates/delegate";
import { Button, UpdatedButton } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNear } from "@/contexts/NearContext";
import { useDelegateAll } from "@/hooks/useDelegateAll";
import { useUndelegate } from "@/hooks/useUndelegate";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export default function NearDelegateDialog({
  delegate,
  onClose,
}: {
  delegate: DelegateChunk;
  onClose: () => void;
}) {
  const { signedAccountId, signIn, signOut } = useNear();
  const { data: accountInfo } = useVenearAccountInfo(signedAccountId);

  const isDelegated = accountInfo?.delegation?.delegatee === delegate.address;

  const { delegateAll } = useDelegateAll();
  const { undelegate } = useUndelegate();

  const handleToggleDelegate = () => {
    if (isDelegated) {
      undelegate();
    } else {
      delegateAll(delegate.address);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <div className="flex flex-col items-center w-full bg-neutral max-w-[28rem]">
          <div className="flex flex-col gap-6 justify-center min-h-[318px] w-full">
            <div className="flex flex-col gap-4">
              <DialogTitle>Set {delegate.address} as your delegate</DialogTitle>
              <div className="text-secondary">
                {delegate.address} will be able to vote with any token owned by
                your address
              </div>
              <div className="flex flex-col relative border border-line rounded-lg">
                <div className="flex flex-row items-center gap-3 p-2 border-b border-line">
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-secondary">
                      Currently delegated to
                    </p>
                    <div className="font-medium text-primary max-w-[6rem] sm:max-w-full">
                      <p>{accountInfo?.delegation?.delegatee ?? "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center bg-neutral border border-line rounded-full absolute right-4 top-[50%] translate-y-[-50%]">
                  <ArrowDownIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-row gap-3 items-center p-2">
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-secondary">
                      Delegating to
                    </p>
                    <div className="font-medium text-primary max-w-[6rem] sm:max-w-full">
                      {delegate.address}
                    </div>
                  </div>
                </div>
              </div>
              <UpdatedButton onClick={handleToggleDelegate}>
                {isDelegated ? "Undelegate" : "Delegate"}
              </UpdatedButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
