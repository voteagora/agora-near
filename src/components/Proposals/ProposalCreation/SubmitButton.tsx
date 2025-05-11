"use client";

import { Button } from "@/components/ui/button";
import { useNear } from "@/contexts/NearContext";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { NEAR_VOTING_OPTIONS } from "@/lib/constants";
import { cx } from "@emotion/css";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

type SubmitButtonProps = {
  baseFee: string;
  voteStorageFee: string;
};

export default function SubmitButton({
  baseFee,
  voteStorageFee,
}: SubmitButtonProps) {
  const { signedAccountId, signIn } = useNear();
  const isConnected = !!signedAccountId;
  const router = useRouter();

  const { getValues, trigger } = useFormContext();

  const { createProposal, isCreatingProposal, createProposalError } =
    useCreateProposal({
      baseFee,
      storageFee: voteStorageFee,
      onSuccess: () => {
        toast.success("Proposal created successfully");
        router.replace("/");
      },
    });

  const onSubmitProposal = useCallback(async () => {
    if (!isConnected) {
      signIn();
      return;
    }

    const isFormValid = await trigger();

    if (!isFormValid) {
      return;
    }

    const formValues = getValues();

    createProposal({
      title: formValues.title,
      description: formValues.description,
      link: formValues.link,
      voting_options: NEAR_VOTING_OPTIONS,
    });
  }, [createProposal, getValues, isConnected, signIn, trigger]);

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant={"outline"}
        disabled={isCreatingProposal}
        onClick={onSubmitProposal}
      >
        {isConnected
          ? isCreatingProposal
            ? "Submitting..."
            : "Submit proposal"
          : "Connect wallet"}
      </Button>
      {createProposalError && (
        <p className="text-negative text-sm break-words">
          {createProposalError?.message}
        </p>
      )}
    </div>
  );
}
