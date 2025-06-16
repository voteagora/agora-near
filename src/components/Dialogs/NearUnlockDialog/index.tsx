import { UnlockProvider } from "../UnlockProvider";
import { NearUnlockDialogContent } from "./NearUnlockDialogContent";

type NearUnlockDialogProps = {
  closeDialog: () => void;
};

export const NearUnlockDialog = (props: NearUnlockDialogProps) => {
  return (
    <UnlockProvider>
      <NearUnlockDialogContent closeDialog={props.closeDialog} />
    </UnlockProvider>
  );
};
