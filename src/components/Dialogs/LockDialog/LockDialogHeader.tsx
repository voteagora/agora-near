import { BreadcrumbHeader } from "@/components/ui/breadcrumb-header";
import { useLockProviderContext } from "../LockProvider";
import { useMemo } from "react";

export const LockDialogHeader = () => {
  const { selectedToken } = useLockProviderContext();

  const steps = useMemo(() => {
    const steps = ["Lock assets"];

    if (selectedToken?.type !== "lst") {
      steps.push("Stake assets");
    }

    return steps;
  }, [selectedToken?.type]);

  return steps.length > 1 ? (
    <BreadcrumbHeader steps={steps} currentStepIndex={0} />
  ) : null;
};
