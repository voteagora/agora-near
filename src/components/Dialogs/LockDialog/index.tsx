import { LockProvider } from "../LockProvider";
import { LockDialogContent } from "./LockDialogContent";
import { MaintenanceDialog } from "./MaintenanceDialog";
import Tenant from "@/lib/tenant/tenant";

export type LockDialogSource = "onboarding" | "account_management";

type NearLockDialogProps = {
  closeDialog: () => void;
  source: LockDialogSource;
  preSelectedTokenId?: string;
};

export const NearLockDialog = (props: NearLockDialogProps) => {
  const tenant = Tenant.current();

  if (tenant.isMaintenanceMode) {
    return <MaintenanceDialog closeDialog={props.closeDialog} />;
  }

  return (
    <LockProvider
      source={props.source}
      preSelectedTokenId={props.preSelectedTokenId}
    >
      <LockDialogContent closeDialog={props.closeDialog} />
    </LockProvider>
  );
};
