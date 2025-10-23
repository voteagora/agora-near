"use client";

import { StakingProvider } from "@/components/Dialogs/StakingProvider";
import { EnterStakingAmount } from "@/components/Dialogs/StakingDialog/EnterStakingAmount";
import { StakingReview } from "@/components/Dialogs/StakingDialog/StakingReview";
import { useCallback, useState } from "react";
import { StakingPool } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useStakingProviderContext } from "@/components/Dialogs/StakingProvider";

type DialogStep = "form" | "review";

function LegacyOnboardingContent() {
  const { isLoading, setSelectedPool } = useStakingProviderContext();
  const [currentStep, setCurrentStep] = useState<DialogStep>("form");
  const queryClient = useQueryClient();
  const router = useRouter();

  const goToDashboard = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VENEAR_CONTRACT_ID],
    });
    router.push("/assets");
  }, [queryClient, router]);

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
    <EnterStakingAmount onContinue={handleContinue} onSkip={goToDashboard} />
  );
}

export default function LegacyOnboardingPage() {
  return null;
}
