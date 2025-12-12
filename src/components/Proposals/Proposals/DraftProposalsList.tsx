"use client";

import { useDraftProposals } from "@/hooks/useDraftProposals";
import { useNear } from "@/contexts/NearContext";
import { Skeleton } from "@/components/ui/skeleton";
import { DraftProposal, DraftProposalStage } from "@/lib/api/proposal/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { decodeMetadata, ProposalType } from "@/lib/proposalMetadata";
import { useMemo } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DraftProposalCard({ draft }: { draft: DraftProposal }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking inside popover
    if ((e.target as HTMLElement).closest('[data-radix-popper-content-wrapper]')) {
      return;
    }
    router.push(`/proposals/drafts/${draft.id}`);
  };

  const getStageColor = (stage: DraftProposalStage) => {
    switch (stage) {
      case DraftProposalStage.DRAFT:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case DraftProposalStage.AWAITING_SUBMISSION:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case DraftProposalStage.SUBMITTED:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStage = (stage: string) => {
    return stage.replace(/_/g, " ");
  };

  const { metadata, description: cleanDescription } = decodeMetadata(
    draft.description || ""
  );

  return (
    <div
      className="border-b border-line p-6 hover:bg-wash cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-primary hover:text-secondary transition-colors">
          {draft.title || "Untitled Draft"}
        </h3>
        <div className="flex items-center gap-2">
          {metadata?.proposalType === ProposalType.Tactical && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="px-2 py-1 text-xs font-semibold rounded-full border bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  TACTICAL
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Tactical Proposal</h4>
                  <p className="text-sm text-secondary">
                    This proposal includes custom configuration metadata.
                  </p>
                  <div className="flex flex-col gap-1 border-t pt-2 mt-2">
                    {metadata.quorumThreshold && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-secondary">Quorum Threshold:</span>
                        <span className="font-medium text-primary">
                          {metadata.quorumThreshold.toLocaleString()} votes
                        </span>
                      </div>
                    )}
                    {metadata.approvalThreshold && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-secondary">Approval Threshold:</span>
                        <span className="font-medium text-primary">
                          {metadata.approvalThreshold.toLocaleString()} votes
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full border",
              getStageColor(draft.stage)
            )}
          >
            {formatStage(draft.stage)}
          </span>
        </div>
      </div>

      <p className="text-sm text-secondary mb-3 line-clamp-2">
        {cleanDescription || "No description provided"}
      </p>

      <div className="flex justify-between items-center text-xs text-tertiary">
        <span>
          Created{" "}
          {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
        </span>
        {draft.updatedAt !== draft.createdAt && (
          <span>
            Updated{" "}
            {formatDistanceToNow(new Date(draft.updatedAt), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>
    </div>
  );
}

export function DraftProposalsList() {
  const { signedAccountId } = useNear();

  const { data, isLoading, error } = useDraftProposals({
    author: signedAccountId || undefined,
  });

  const filteredDrafts = useMemo(
    () =>
      data?.draftProposals.filter(
        (draft) => draft.stage !== DraftProposalStage.SUBMITTED
      ),
    [data]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-secondary">
        <p>Error loading drafts: {error.message}</p>
      </div>
    );
  }

  if (!signedAccountId) {
    return (
      <div className="p-6 text-center text-secondary">
        <p>Connect your wallet to view your draft proposals</p>
      </div>
    );
  }

  if (!filteredDrafts?.length) {
    return (
      <div className="p-6 text-center text-secondary">
        <p>No draft proposals found</p>
        <p className="text-sm mt-1">
          Create your first proposal to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      {filteredDrafts?.map((draft) => (
        <DraftProposalCard key={draft.id} draft={draft} />
      ))}
    </div>
  );
}
