import { LockProvider } from "../LockProvider";
import { NearLockDialogContent } from "./NearLockDialogContent";

export type LockDialogSource = "onboarding" | "account_management";

type NearLockDialogProps = {
  closeDialog: () => void;
  source: LockDialogSource;
};

export const NearLockDialog = (props: NearLockDialogProps) => {
  return (
    <LockProvider source={props.source}>
      <NearLockDialogContent closeDialog={props.closeDialog} />
    </LockProvider>
  );
};
