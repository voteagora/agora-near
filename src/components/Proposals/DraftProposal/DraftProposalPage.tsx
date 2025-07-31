"use client";

import {
  useDraftProposal,
  useUpdateDraftProposal,
  useDeleteDraftProposal,
} from "@/hooks/useDraftProposals";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useNear } from "@/contexts/NearContext";
import { VStack, HStack } from "@/components/Layout/Stack";
import { Button } from "@/components/ui/button";
import Markdown from "@/components/shared/Markdown/Markdown";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { DraftProposalStage } from "@/lib/api/proposal/types";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronLeftIcon, TrashIcon } from "lucide-react";
import { NEAR_VOTING_OPTIONS } from "@/lib/constants";
import DraftEditForm, { DraftEditFormRef } from "./DraftEditForm";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";

type DraftProposalPageProps = {
  draftId: string;
};

function ScreeningCommitteePanel({ reviewerIds }: { reviewerIds: string[] }) {
  return (
    <div className="bg-wash rounded-xl border border-line p-6">
      <h2 className="text-2xl font-extrabold mb-4 text-primary">
        Approval Request
      </h2>
      <p className="text-sm text-secondary mb-4">
        Submitting your proposal will send it to the Screening Committee for
        review. Any committee member can approve it. Once approved, your
        proposal will go live for one day.
      </p>

      <h3 className="text-lg font-semibold mb-3 text-primary border-t pt-4">
        Screening Committee Members
      </h3>
      <div className="space-y-2">
        {reviewerIds.map((reviewerId) => (
          <div key={reviewerId} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-secondary">
                {reviewerId.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-primary">{reviewerId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DraftProposalPage({ draftId }: DraftProposalPageProps) {
  const router = useRouter();
  const { signedAccountId } = useNear();
  const { config, isLoading: configLoading } = useProposalConfig();
  const openDialog = useOpenDialog();
  const draftFormRef = useRef<DraftEditFormRef>(null);
  const {
    data: draft,
    isLoading: draftLoading,
    error,
  } = useDraftProposal(draftId);
  const { mutate: updateDraft, isPending: isUpdating } =
    useUpdateDraftProposal();
  const { mutate: deleteDraft, isPending: isDeleting } =
    useDeleteDraftProposal();

  const [step, setStep] = useState<1 | 2>(1);
  const [formState, setFormState] = useState({
    isDirty: false,
    isValid: false,
    isSaving: false,
  });

  const { createProposalAsync, isCreatingProposal, createProposalError } =
    useCreateProposal({
      baseFee: config?.base_proposal_fee || "0",
      storageFee: config?.vote_storage_fee || "0",
    });

  const isLoading = draftLoading || configLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Draft Not Found
        </h1>
        <p className="text-secondary mb-4">
          The draft proposal you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!draft || !config) {
    return null;
  }

  if (draft.author !== signedAccountId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-primary mb-2">Access Denied</h1>
        <p className="text-secondary mb-4">
          You can only view your own draft proposals.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2);
      updateDraft({
        id: draftId,
        data: {
          stage: DraftProposalStage.AWAITING_SUBMISSION,
        },
      });
      return;
    }

    try {
      const transactionResult = await createProposalAsync({
        title: draft.title,
        description: draft.description,
        link: draft.proposalUrl || "",
        voting_options: NEAR_VOTING_OPTIONS,
      });

      const receiptId = transactionResult?.[0]?.transaction?.hash || null;

      updateDraft({
        id: draftId,
        data: {
          stage: DraftProposalStage.SUBMITTED,
          receiptId,
        },
      });

      toast.success("Proposal submitted successfully");
      router.replace("/proposals");
    } catch (error) {
      console.error("Failed to submit proposal:", error);
    }
  };

  const handleDelete = () => {
    openDialog({
      type: "CONFIRM",
      params: {
        title: "Delete Draft",
        message:
          "Are you sure you want to delete this draft? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "danger" as const,
        onConfirm: () => {
          deleteDraft(draftId, {
            onSuccess: () => {
              toast.success("Draft deleted");
              router.replace("/proposals");
            },
            onError: (error: any) => {
              toast.error("Failed to delete draft");
              console.error(error);
            },
          });
        },
      },
    });
  };

  const stepText = step === 1 ? "Step 1/2" : "Step 2/2";
  const buttonText =
    step === 1
      ? "Continue to Review"
      : isCreatingProposal
        ? "Submitting..."
        : "Submit for Approval";

  const isEmptyDraft = !draft.title && !draft.description;

  return (
    <div className="max-w-[76rem] mx-auto mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              step === 1 ? router.push("/proposals") : setStep(1)
            }
            className="flex items-center justify-center p-0 h-8 w-8 rounded-full"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <div className="flex gap-4 items-center">
            <h1 className="text-2xl font-bold text-primary">
              {step === 1
                ? isEmptyDraft
                  ? "Create Proposal"
                  : "Edit Proposal"
                : "Submit Proposal"}
            </h1>
            <span className="text-sm text-muted-foreground">{stepText}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {step === 1 && (
            <>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:text-red-700 hover:bg-red-50 hover:border-red-300 border-0 hover:border"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => draftFormRef.current?.handleSave()}
                variant="outline"
                className="rounded-full"
                disabled={!formState.isDirty || formState.isSaving}
              >
                {formState.isSaving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                onClick={handleSubmit}
                className="rounded-full"
                disabled={!formState.isValid || isUpdating}
              >
                {buttonText}
              </Button>
            </>
          )}
          {step === 2 && (
            <Button
              onClick={handleSubmit}
              disabled={
                isCreatingProposal ||
                isUpdating ||
                !draft.title ||
                !draft.description
              }
              className="rounded-full"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>

      {step === 1 ? (
        <DraftEditForm
          ref={draftFormRef}
          draft={draft}
          config={config}
          onFormStateChange={setFormState}
        />
      ) : (
        <HStack
          justifyContent="justify-between"
          gap={16}
          className="w-full flex flex-col-reverse items-center lg:flex-row lg:items-start"
        >
          <VStack className="w-full">
            <div className="bg-neutral rounded-xl border border-line shadow-newDefault">
              <div className="p-8 border-b border-line">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {draft.title || "Untitled Proposal"}
                    </h2>
                    <p className="text-sm text-secondary">
                      <span className="font-semibold">Submitted by:</span>{" "}
                      {draft.author}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border rounded-lg p-4">
                  {draft.proposalUrl && (
                    <div className="flex items-center gap-2 border rounded-lg p-4 bg-wash">
                      <h4 className="text-sm font-semibold text-secondary">
                        Forum Link:
                      </h4>
                      <a
                        href={draft.proposalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-secondary underline text-sm"
                      >
                        {draft.proposalUrl}
                      </a>
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none">
                    <Markdown
                      content={draft.description || "*No description provided*"}
                    />
                  </div>
                </div>
              </div>

              {(!draft.title || !draft.description || createProposalError) && (
                <div className="p-8">
                  {(!draft.title || !draft.description) && (
                    <p className="text-amber-600 text-sm">
                      Please complete the title and description before
                      submitting.
                    </p>
                  )}

                  {createProposalError && (
                    <p className="text-negative text-sm break-words mt-2">
                      {createProposalError?.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </VStack>

          <div className="shrink-0 w-full lg:w-[24rem]">
            <ScreeningCommitteePanel reviewerIds={config.reviewer_ids} />
          </div>
        </HStack>
      )}
    </div>
  );
}
