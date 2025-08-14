import {
  UpdateDraftProposalRequest,
  DraftProposalStage,
  UpdateDraftProposalStageRequest,
} from "@/lib/api/proposal/types";
import {
  createDraftProposal,
  fetchDraftProposals,
  fetchDraftProposal,
  updateDraftProposal,
  deleteDraftProposal,
  updateDraftProposalStage,
} from "@/lib/api/proposal/requests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNear } from "@/contexts/NearContext";

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
  const { signMessage, signedAccountId } = useNear();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDraftProposalRequest;
    }) => {
      if (!signedAccountId) {
        throw new Error("User not signed in");
      }

      const messageData = {
        id,
        ...data,
      };

      const serializedMessage = JSON.stringify(messageData, undefined, "\t");
      const signature = await signMessage({ message: serializedMessage });

      if (!signature) {
        throw new Error("Signature failed");
      }

      return updateDraftProposal(id, {
        ...data,
        signature: signature.signature,
        publicKey: signature.publicKey,
      });
    },
    onSuccess: (updatedDraft) => {
      queryClient.invalidateQueries({ queryKey: [DRAFT_PROPOSALS_QK] });
      queryClient.setQueryData(
        [DRAFT_PROPOSALS_QK, updatedDraft.id],
        updatedDraft
      );
    },
  });
}

export function useUpdateDraftProposalStage() {
  const queryClient = useQueryClient();
  const { signedAccountId } = useNear();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDraftProposalStageRequest;
    }) => {
      if (!signedAccountId) {
        throw new Error("User not signed in");
      }

      return updateDraftProposalStage(id, {
        stage: data.stage,
        receiptId: data.receiptId,
      });
    },
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
  const { signMessage, signedAccountId } = useNear();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!signedAccountId) {
        throw new Error("User not signed in");
      }

      const messageData = {
        id,
        action: "delete" as const,
      };

      const serializedMessage = JSON.stringify(messageData, undefined, "\t");
      const signature = await signMessage({ message: serializedMessage });

      if (!signature) {
        throw new Error("Signature failed");
      }

      return deleteDraftProposal({
        id,
        action: "delete",
        signature: signature.signature,
        publicKey: signature.publicKey,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRAFT_PROPOSALS_QK] });
    },
  });
}
