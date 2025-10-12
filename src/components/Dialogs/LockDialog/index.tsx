import { LockProvider } from "../LockProvider";
import { LockDialogContent } from "./LockDialogContent";
import { MaintenanceDialog } from "./MaintenanceDialog";
import Tenant from "@/lib/tenant/tenant";
import { useEffect } from "react";
import { MixpanelEvents } from "@/lib/analytics/mixpanel";
import { trackEvent } from "@/lib/analytics";

export type LockDialogSource = "onboarding" | "account_management";

type NearLockDialogProps = {
  closeDialog: () => void;
  source: LockDialogSource;
  preSelectedTokenId?: string;
};

export const NearLockDialog = (props: NearLockDialogProps) => {
  const tenant = Tenant.current();

  useEffect(() => {
    trackEvent({
      event_name: MixpanelEvents.StartedLockAndStake,
      event_data: {
        source: props.source,
        preSelectedTokenId: props.preSelectedTokenId,
      },
    });
  }, [props.source, props.preSelectedTokenId]);

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
