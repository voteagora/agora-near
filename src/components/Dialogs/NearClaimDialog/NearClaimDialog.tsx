import { useNearClaimProofs } from "@/hooks/useNearClaimProofs";
import { useNear } from "@/contexts/NearContext";
import { UpdatedButton } from "@/components/Button";
import { CheckIcon, StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { ClaimProof } from "@/types/nearClaim";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { useClaimNearRewards } from "@/hooks/useClaimNearRewards";
import toast from "react-hot-toast";
import { convertYoctoToNear } from "@/lib/utils";
import { NEAR_TOKEN_METADATA } from "@/lib/constants";
import { AssetIcon } from "@/components/common/AssetIcon";

interface NearClaimDialogProps {
  closeDialog: () => void;
}

export function NearClaimDialog({ closeDialog }: NearClaimDialogProps) {
  const { signedAccountId } = useNear();
  const { unclaimedProofs, totalUnclaimedAmount, refetch } =
    useNearClaimProofs(signedAccountId);
  const [currentStep, setCurrentStep] = useState<
    "initial" | "processing" | "success"
  >("initial");
  const [claimedAmount, setClaimedAmount] = useState<string>("0");

  const { claimReward, isClaiming } = useClaimNearRewards({
    onSuccess: () => {
      setCurrentStep("success");
      refetch(); // Refresh the proofs data
    },
  });

  const hasMultipleProofs = unclaimedProofs.length > 1;

  const handleClaim = async (proofs: ClaimProof[] = unclaimedProofs) => {
    setCurrentStep("processing");

    try {
      let totalClaimed = BigInt(0);

      for (const proof of proofs) {
        if (!proof.proofData?.proof) {
          throw new Error(`No merkle proof available`);
        }

        await claimReward({
          amount: proof.amount, // Amount in yocto NEAR from the API
          merkleProof: proof.proofData.proof,
          campaignId: proof.campaignId,
          lockupContract: proof.lockup,
        });

        totalClaimed += BigInt(proof.amount);
        toast.success(`Claimed ${convertYoctoToNear(proof.amount, 2)} NEAR`);
      }

      setClaimedAmount(totalClaimed.toString());
    } catch (error) {
      console.error("Failed to claim rewards:", error);
      toast.error(
        `Failed to claim rewards: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setCurrentStep("initial");
    }
  };

  const openDialog = useOpenDialog();

  const handleStakeRewards = () => {
    closeDialog();
    // Open the Lock dialog with staking source
    openDialog({
      type: "NEAR_LOCK",
      params: {
        source: "claim_rewards",
      },
    });
  };

  if (currentStep === "processing") {
    return (
      <div className="flex flex-col items-center w-full bg-neutral max-w-[28rem]">
        <div className="flex flex-col gap-6 justify-center min-h-[300px] w-full items-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Processing Claims
            </h2>
            <p className="text-secondary text-sm">
              Please wait while we process your reward claims...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "success") {
    return (
      <div className="flex flex-col items-center w-full bg-neutral max-w-[28rem] my-8">
        <div className="flex flex-col gap-6 justify-center min-h-[400px] w-full items-center">
          <div className="relative">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <div className="absolute -top-2 -left-2">
              <StarIcon className="w-6 h-6 text-green-400" />
            </div>
            <div className="absolute -top-2 -right-2">
              <StarIcon className="w-6 h-6 text-green-400" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <StarIcon className="w-4 h-4 text-green-300" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <StarIcon className="w-4 h-4 text-green-300" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-secondary mb-2">You just claimed a reward of</p>
            <div className="text-3xl font-bold text-primary mb-1">
              {convertYoctoToNear(claimedAmount || totalUnclaimedAmount, 2)}
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-secondary">
              <AssetIcon
                icon={NEAR_TOKEN_METADATA.icon}
                name={NEAR_TOKEN_METADATA.name}
              />
              NEAR
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <UpdatedButton
              type="primary"
              onClick={handleStakeRewards}
              fullWidth
            >
              Stake my rewards
            </UpdatedButton>
            <UpdatedButton type="secondary" onClick={closeDialog} fullWidth>
              Done
            </UpdatedButton>
          </div>
        </div>
      </div>
    );
  }

  if (!hasMultipleProofs) {
    return (
      <div className="flex flex-col items-center w-full bg-neutral max-w-[28rem] my-8">
        <div className="flex flex-col gap-6 justify-center min-h-[300px] w-full">
          <div className="text-center">
            <p className="text-secondary mb-2">Available to claim</p>
            <div className="text-4xl font-bold text-primary mb-1">
              {convertYoctoToNear(totalUnclaimedAmount, 2)}
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-secondary">
              <AssetIcon
                icon={NEAR_TOKEN_METADATA.icon}
                name={NEAR_TOKEN_METADATA.name}
              />
              NEAR
            </div>
          </div>

          <div className="text-center border border-line rounded-lg p-4 my-8">
            <p className="text-secondary text-sm">
              Explainer on how rewards work and why you got what you got. Ad
              sint eiusmod officia occaecat veniam nulla laborum ut nostrud
              incididunt officia labore.
            </p>
          </div>

          <UpdatedButton
            type="primary"
            onClick={() => handleClaim()}
            isLoading={isClaiming}
            fullWidth
          >
            Claim rewards
          </UpdatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-neutral max-w-[32rem] my-8">
      <div className="flex flex-col gap-6 justify-center min-h-[400px] w-full">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-2">
            Claim your rewards
          </h2>
          <p className="text-secondary text-sm">
            You have {unclaimedProofs.length} unclaimed rewards totaling{" "}
            {convertYoctoToNear(totalUnclaimedAmount, 2)} NEAR
          </p>
        </div>

        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
          {unclaimedProofs.map((proof) => (
            <div
              key={`${proof.campaignId}-${proof.treeIndex}`}
              className="flex items-center justify-between p-3 border border-line rounded-lg"
            >
              <div>
                <p className="font-medium text-primary">{proof.project.name}</p>
                <p className="text-sm text-secondary">
                  {convertYoctoToNear(proof.amount, 2)} NEAR
                </p>
              </div>
              <UpdatedButton
                type="secondary"
                onClick={() => handleClaim([proof])}
                isLoading={isClaiming}
                className="px-3 py-1 text-sm"
              >
                Claim
              </UpdatedButton>
            </div>
          ))}
        </div>

        <UpdatedButton
          type="primary"
          onClick={() => handleClaim()}
          isLoading={isClaiming}
          fullWidth
        >
          Claim all rewards
        </UpdatedButton>
      </div>
    </div>
  );
}
