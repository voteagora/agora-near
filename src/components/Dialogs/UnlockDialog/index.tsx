import { UnlockProvider } from "../UnlockProvider";
import { UnlockDialogContent } from "./UnlockDialogContent";

type UnlockDialogProps = {
  closeDialog: () => void;
};

export const UnlockDialog = (props: UnlockDialogProps) => {
  return (
    <UnlockProvider>
      <UnlockDialogContent closeDialog={props.closeDialog} />
    </UnlockProvider>
  );
};
