import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { UpdatedButton } from "@/components/Button";
import { DelegateProfile } from "@/lib/api/delegates/types";
import { useNear } from "@/contexts/NearContext";

export const DelegateToSelf = ({
  variant = "default",
  className,
  delegate,
  label = "Delegate to self",
}: {
  variant?: "rounded" | "default";
  className?: string;
  delegate: DelegateProfile;
  label?: string;
}) => {
  const { signIn, signedAccountId } = useNear();
  const openDialog = useOpenDialog();

  const onButtonClick = () => {
    if (!signedAccountId) {
      signIn();
    } else {
      openDialog({
        type: "NEAR_DELEGATE",
        params: {
          delegateAddress: signedAccountId, // Delegate to self using own account ID
        },
      });
    }
  };

  return (
    <UpdatedButton type="primary" onClick={onButtonClick} className={className}>
      {label}
    </UpdatedButton>
  );
};
