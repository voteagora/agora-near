"use client";

import { useCallback, memo } from "react";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { UpdatedButton } from "../Button";
import { useOpenDialog } from "../Dialogs/DialogProvider/DialogProvider";
import { useNear } from "@/contexts/NearContext";
import AgoraLoader from "../shared/AgoraLoader/AgoraLoader";
import { ProjectionSlider } from "../shared/ProjectionSlider";
import { LockTokensCard } from "./LockTokensCard";
import { StakingRewardsCard } from "./StakingRewardsCard";

export const AssetsHome = memo(() => {
  const openDialog = useOpenDialog();
  const { signedAccountId } = useNear();
  const { data: accountInfo, isLoading: isLoadingAccount } =
    useVenearAccountInfo(signedAccountId);

  // Mock data for now
  const mockAPY = 0.0599;
  const mockStartingAmount = 5000;

  const handleStakeAndLock = useCallback(() => {
    openDialog({
      type: "NEAR_LOCK",
      params: {
        source: accountInfo ? "account_management" : "onboarding",
      },
    });
  }, [openDialog, accountInfo]);

  const handleProjectionChange = useCallback(
    (projection: { amount: number; years: number }) => {
      console.log("Projection changed:", projection);
    },
    []
  );

  if (isLoadingAccount) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <AgoraLoader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative">
      <div className="flex flex-col gap-16 mt-12">
        <div className="grid relative mx-auto py-16">
          <div className="absolute inset-0 overflow-hidden p-4">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(20, 1fr)",
                gap: "2rem",
              }}
            >
              {Array.from({ length: 700 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 text-black flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="currentColor"
                  >
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="text-left order-1 z-10 bg-white py-8 ml-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
                Lock & stake tokens for boosted voting power rewards
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Cras sed scelerisque elementum adipiscing vestibulum. Aenean
                morbi aenean nunc
              </p>
              <UpdatedButton
                type="primary"
                variant="rounded"
                onClick={handleStakeAndLock}
                className="px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-black/90 rounded-lg"
              >
                Stake & Lock
              </UpdatedButton>
            </div>

            <div className="flex flex-row gap-6 order-2">
              <div className="mb-4 w-[300px] h-[400px]">
                <LockTokensCard apy="5.99%" />
              </div>
              <div className="mt-4 w-[300px] h-[400px] flex grow">
                <StakingRewardsCard apy="5.99%" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <ProjectionSlider
            apy={mockAPY}
            startingAmount={mockStartingAmount}
            onProjectionChange={handleProjectionChange}
          />
        </div>
      </div>
    </div>
  );
});

AssetsHome.displayName = "AssetsHome";
