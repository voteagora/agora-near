import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useState } from "react";
import { StakingProvider, useStakingProviderContext } from "../StakingProvider";
import { EnterStakingAmount } from "./EnterStakingAmount";
import { StakingReview } from "./StakingReview";
import { StakingPool } from "@/lib/types";

type NearStakingDialogProps = {
  closeDialog: () => void;
};

type DialogStep = "form" | "review";

const StakingDialogContent = ({ closeDialog }: { closeDialog: () => void }) => {
  const { isLoading, setSelectedPool } = useStakingProviderContext();
  const [currentStep, setCurrentStep] = useState<DialogStep>("form");

  const handleContinue = (pool: StakingPool) => {
    setSelectedPool(pool);
    setCurrentStep("review");
  };

  const handleBack = () => {
    setCurrentStep("form");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (currentStep === "review") {
    return <StakingReview onBack={handleBack} />;
  }

  return (
    <EnterStakingAmount onContinue={handleContinue} onSkip={closeDialog} />
  );
};

export const NearStakingDialog = ({ closeDialog }: NearStakingDialogProps) => {
  return (
    <StakingProvider>
      <div className="flex flex-col items-center h-[600px] p-4">
        <StakingDialogContent closeDialog={closeDialog} />
      </div>
    </StakingProvider>
  );
};
