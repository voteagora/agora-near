"use client";

import { useDraftProposals } from "@/hooks/useDraftProposals";
import { useNear } from "@/contexts/NearContext";
import { Skeleton } from "@/components/ui/skeleton";
import { DraftProposal, DraftProposalStage } from "@/lib/api/proposal/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function DraftProposalCard({ draft }: { draft: DraftProposal }) {
  const router = useRouter();

  const handleClick = () => {
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

  return (
    <div
      className="border-b border-line p-6 hover:bg-wash cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-primary hover:text-secondary transition-colors">
          {draft.title || "Untitled Draft"}
        </h3>
        <span
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-full border",
            getStageColor(draft.stage)
          )}
        >
          {draft.stage}
        </span>
      </div>

      <p className="text-sm text-secondary mb-3 line-clamp-2">
        {draft.description || "No description provided"}
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
    stage: DraftProposalStage.DRAFT,
  });

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

  if (!data?.draftProposals.length) {
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
      {data.draftProposals.map((draft) => (
        <DraftProposalCard key={draft.id} draft={draft} />
      ))}
    </div>
  );
}
