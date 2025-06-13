"use client";

import { useCastVote } from "@/hooks/useCastVote";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { useEffect, memo } from "react";
import toast from "react-hot-toast";
import { LoadingVote } from "../Proposals/ProposalPage/CastVoteDialog/CastVoteDialog";

interface NearVoteDialogProps {
  proposal: ProposalInfo;
  config: VotingConfig;
  closeDialog: () => void;
  preSelectedVote?: number;
  onSuccess?: () => void;
}

function NearVoteDialogComponent({
  proposal,
  config,
  closeDialog,
  preSelectedVote,
  onSuccess,
}: NearVoteDialogProps) {
  const { castVote } = useCastVote({ onSuccess });

  useEffect(() => {
    const castVoteOnMount = async () => {
      if (
        !config?.vote_storage_fee ||
        preSelectedVote === undefined ||
        !proposal?.snapshot_and_state?.snapshot.block_height
      ) {
        toast.error(`Something went wrong`);
        closeDialog();
        return;
      }

      try {
        await castVote({
          proposalId: proposal.id,
          voteIndex: preSelectedVote,
          blockId: proposal.snapshot_and_state.snapshot.block_height,
          voteStorageFee: config.vote_storage_fee,
        });
      } catch (error) {
        console.error(`Error casting vote: ${error}`);
      } finally {
        closeDialog();
      }
    };

    castVoteOnMount();
  }, []);

  return <LoadingVote />;
}

export const NearVoteDialog = memo(NearVoteDialogComponent);
