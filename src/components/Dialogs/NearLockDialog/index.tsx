import { LockProvider } from "../LockProvider";
import { NearLockDialogContent } from "./NearLockDialogContent";

export type LockDialogSource = "onboarding" | "account_management";

type NearLockDialogProps = {
  closeDialog: () => void;
  source: LockDialogSource;
  preSelectedTokenId?: string;
};

export const NearLockDialog = (props: NearLockDialogProps) => {
  return (
    <LockProvider
      source={props.source}
      preSelectedTokenId={props.preSelectedTokenId}
    >
      <NearLockDialogContent closeDialog={props.closeDialog} />
    </LockProvider>
  );
};
