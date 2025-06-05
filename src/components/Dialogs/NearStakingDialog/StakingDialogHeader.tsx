import { BreadcrumbHeader } from "@/components/ui/breadcrumb-header";

import { useMemo } from "react";
import { useStakingProviderContext } from "../StakingProvider";

export const StakingDialogHeader = () => {
  const { source } = useStakingProviderContext();

  const steps = useMemo(() => {
    const steps = [];

    if (source === "onboarding") {
      steps.push("Lock assets");
    }

    steps.push("Stake assets");

    return steps;
  }, [source]);

  return source === "onboarding" ? (
    <BreadcrumbHeader
      steps={steps}
      currentStepIndex={source === "onboarding" ? 1 : 0}
    />
  ) : null;
};
