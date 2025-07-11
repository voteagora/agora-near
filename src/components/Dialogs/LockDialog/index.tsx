import { LockProvider } from "../LockProvider";
import { LockDialogContent } from "./LockDialogContent";

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
      <LockDialogContent closeDialog={props.closeDialog} />
    </LockProvider>
  );
};
