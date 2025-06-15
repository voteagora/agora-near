import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useCallback, useState } from "react";
import { StakingProvider, useStakingProviderContext } from "../StakingProvider";
import { EnterStakingAmount } from "./EnterStakingAmount";
import { StakingReview } from "./StakingReview";
import { StakingPool } from "@/lib/types";
import { StakingDialogHeader } from "./StakingDialogHeader";
import { useQueryClient } from "@tanstack/react-query";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { useRouter } from "next/navigation";

export type StakingSource = "onboarding" | "account_management";

type NearStakingDialogProps = {
  closeDialog: () => void;
  source: StakingSource;
};

type DialogStep = "form" | "review";

const StakingDialogContent = ({ closeDialog }: { closeDialog: () => void }) => {
  const { isLoading, setSelectedPool } = useStakingProviderContext();
  const [currentStep, setCurrentStep] = useState<DialogStep>("form");

  const queryClient = useQueryClient();

  const router = useRouter();

  const goToDashboard = useCallback(() => {
    closeDialog();
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
    });
    router.push("/assets");
  }, [closeDialog, queryClient, router]);

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
    return (
      <StakingReview onBack={handleBack} handleViewDashboard={goToDashboard} />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <StakingDialogHeader />
      <EnterStakingAmount onContinue={handleContinue} onSkip={goToDashboard} />
    </div>
  );
};

export const NearStakingDialog = ({
  closeDialog,
  source,
}: NearStakingDialogProps) => {
  return (
    <StakingProvider source={source}>
      <div className="flex flex-col items-center h-[600px] p-4">
        <StakingDialogContent closeDialog={closeDialog} />
      </div>
    </StakingProvider>
  );
};
