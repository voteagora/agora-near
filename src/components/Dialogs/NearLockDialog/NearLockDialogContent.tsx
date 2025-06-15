import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { TokenWithBalance } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useOpenDialog } from "../DialogProvider/DialogProvider";
import { useLockProviderContext } from "../LockProvider";
import { AssetSelector } from "./AssetSelector";
import { EnterAmountStep } from "./EnterAmountStep";
import { LockDialogHeader } from "./LockDialogHeader";
import { ReviewStep } from "./ReviewStep";

type DialogContentProps = {
  closeDialog: () => void;
};

export function NearLockDialogContent({ closeDialog }: DialogContentProps) {
  const { setSelectedToken, isLoading, resetForm, source } =
    useLockProviderContext();

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);

  const openDialog = useOpenDialog();

  const queryClient = useQueryClient();

  const handleReview = () => {
    setCurrentStep(2);
  };

  const handleEdit = () => {
    setCurrentStep(1);
  };

  const handleLockMore = () => {
    setCurrentStep(1);
  };

  const openAssetSelector = useCallback(() => {
    setIsAssetSelectorOpen(true);
  }, []);

  const closeAssetSelector = useCallback(
    () => setIsAssetSelectorOpen(false),
    []
  );

  const handleTokenSelect = useCallback(
    (token: TokenWithBalance) => {
      setSelectedToken(token);
      resetForm();
      closeAssetSelector();
    },
    [setSelectedToken, resetForm, closeAssetSelector]
  );

  const proceedToStaking = useCallback(() => {
    closeDialog();
    openDialog({
      type: "NEAR_STAKING",
      className: "sm:w-[500px]",
      params: {
        source,
      },
    });
  }, [closeDialog, openDialog, source]);

  const handleViewDashboard = useCallback(() => {
    closeDialog();
    queryClient.invalidateQueries({
      queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
    });
    router.push("/assets");
  }, [closeDialog, queryClient, router]);

  const content = useMemo(() => {
    if (isAssetSelectorOpen) {
      return <AssetSelector handleTokenSelect={handleTokenSelect} />;
    }

    if (currentStep === 1) {
      return (
        <div className="flex flex-col gap-2 h-full">
          <LockDialogHeader />
          <EnterAmountStep
            openAssetSelector={openAssetSelector}
            handleReview={handleReview}
          />
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <ReviewStep
          handleEdit={handleEdit}
          handleLockMore={handleLockMore}
          handleProceedToStaking={proceedToStaking}
          handleViewDashboard={handleViewDashboard}
        />
      );
    }

    return null;
  }, [
    currentStep,
    handleTokenSelect,
    handleViewDashboard,
    isAssetSelectorOpen,
    openAssetSelector,
    proceedToStaking,
  ]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[600px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pt-4 px-4 h-[600px]">
      {content}
    </div>
  );
}
