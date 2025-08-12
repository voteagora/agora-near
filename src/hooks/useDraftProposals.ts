import {
  UpdateDraftProposalRequest,
  DraftProposalStage,
} from "@/lib/api/proposal/types";
import {
  createDraftProposal,
  fetchDraftProposals,
  fetchDraftProposal,
  updateDraftProposal,
  deleteDraftProposal,
} from "@/lib/api/proposal/requests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DRAFT_PROPOSALS_QK = "draft-proposals";

export function useDraftProposals(params?: {
  author?: string;
  stage?: DraftProposalStage;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: [DRAFT_PROPOSALS_QK, params],
    queryFn: () => fetchDraftProposals(params),
  });
}

export function useDraftProposal(id: string) {
  return useQuery({
    queryKey: [DRAFT_PROPOSALS_QK, id],
    queryFn: () => fetchDraftProposal(id),
    enabled: !!id,
  });
}

export function useCreateDraftProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraftProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRAFT_PROPOSALS_QK] });
    },
  });
}

export function useUpdateDraftProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDraftProposalRequest;
    }) => updateDraftProposal(id, data),
    onSuccess: (updatedDraft) => {
      queryClient.invalidateQueries({ queryKey: [DRAFT_PROPOSALS_QK] });
      queryClient.setQueryData(
        [DRAFT_PROPOSALS_QK, updatedDraft.id],
        updatedDraft
      );
    },
  });
}

export function useDeleteDraftProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDraftProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRAFT_PROPOSALS_QK] });
    },
  });
}
