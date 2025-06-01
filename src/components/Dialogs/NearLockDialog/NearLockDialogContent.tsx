import { TokenWithBalance } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useLockProviderContext } from "../LockProvider";
import { AssetSelector } from "./AssetSelector";
import { EnterAmountStep } from "./EnterAmountStep";
import { ReviewStep } from "./ReviewStep";

export function NearLockDialogContent() {
  const { setSelectedToken, isLoading, resetForm } = useLockProviderContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);

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

  const content = useMemo(() => {
    if (isAssetSelectorOpen) {
      return <AssetSelector handleTokenSelect={handleTokenSelect} />;
    }

    if (currentStep === 1) {
      return (
        <EnterAmountStep
          openAssetSelector={openAssetSelector}
          handleReview={handleReview}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <ReviewStep handleEdit={handleEdit} handleLockMore={handleLockMore} />
      );
    }

    return null;
  }, [currentStep, handleTokenSelect, isAssetSelectorOpen, openAssetSelector]);

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
