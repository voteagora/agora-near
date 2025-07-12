import { BreadcrumbHeader } from "@/components/ui/breadcrumb-header";

export const StakingDialogHeader = () => {
  return (
    <BreadcrumbHeader
      steps={["Lock assets", "Stake assets"]}
      currentStepIndex={1}
    />
  );
};
