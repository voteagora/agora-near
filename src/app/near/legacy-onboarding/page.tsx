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
  return (
    <div className="flex min-h-screen flex-col">
      <div className="max-w-3xl w-full mx-auto p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-2">Onboard legacy staked tokens</h1>
        <p className="text-[#6B7280] mb-8">
          Lock your NEAR and stake with a whitelisted custom pool. If you already
          stake with a pool, enter its account ID below.
        </p>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <StakingProvider source="onboarding">
            <LegacyOnboardingContent />
          </StakingProvider>
        </div>
      </div>
    </div>
  );
}


