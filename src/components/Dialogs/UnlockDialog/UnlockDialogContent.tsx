import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useUnlockProviderContext } from "../UnlockProvider";
import { EnterAmountStep } from "./EnterAmountStep";
import { ReviewStep } from "./ReviewStep";

type DialogContentProps = {
  closeDialog: () => void;
};

export function UnlockDialogContent({ closeDialog }: DialogContentProps) {
  const { isLoading } = useUnlockProviderContext();

  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);

  const handleReview = useCallback(() => {
    setCurrentStep(2);
  }, []);

  const handleEdit = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleViewDashboard = useCallback(() => {
    closeDialog();
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VENEAR_CONTRACT_ID],
    });
    router.push("/assets");
  }, [closeDialog, queryClient, router]);

  const content = useMemo(() => {
    if (currentStep === 1) {
      return (
        <div className="flex flex-col gap-2 h-full">
          <EnterAmountStep handleReview={handleReview} />
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <ReviewStep
          handleEdit={handleEdit}
          handleViewDashboard={handleViewDashboard}
        />
      );
    }

    return null;
  }, [currentStep, handleEdit, handleReview, handleViewDashboard]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[600px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pt-4 px-2 h-[600px]">
      {content}
    </div>
  );
}
