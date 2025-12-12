"use client";

import { useCastVote } from "@/hooks/useCastVote";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { useEffect, memo, useState } from "react";
import toast from "react-hot-toast";
import { useNear } from "@/contexts/NearContext";
import { useFetchProof } from "@/hooks/useFetchProof";
import { MerkleProof } from "@/lib/contracts/types/common";
import { VAccount } from "@/lib/contracts/types/venear";
import { UpdatedButton } from "@/components/Button";

export function LoadingVote() {
  return (
    <div className="flex flex-col w-full">
      <div className="mb-2 text-2xl font-black text-primary">
        Casting your vote
      </div>
      <div className="mb-5 text-sm text-secondary">
        It might take up to a minute for the changes to be reflected.
      </div>
      <div>
        <div
          className={`flex flex-row justify-center w-full py-3 bg-line rounded-lg`}
        >
          <div className="font-medium text-secondary">
            Writing your vote to the chain...
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const { castVote, isVoting } = useCastVote({ onSuccess });
  const { signedAccountId } = useNear();
  const fetchProof = useFetchProof();

  const [isLoadingProof, setIsLoadingProof] = useState(false);
  const [proof, setProof] = useState<[MerkleProof, VAccount] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProof = async () => {
      if (
        !proposal?.snapshot_and_state?.snapshot.block_height ||
        !signedAccountId
      ) {
        return;
      }
      setIsLoadingProof(true);
      try {
        const result = await fetchProof(
          signedAccountId,
          proposal.snapshot_and_state.snapshot.block_height
        );
        if (result) {
          setProof(result);
        } else {
          setError("Failed to fetch merkle proof");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching proof");
      } finally {
        setIsLoadingProof(false);
      }
    };

    loadProof();
  }, [
    fetchProof,
    proposal?.snapshot_and_state?.snapshot.block_height,
    signedAccountId,
  ]);

  const handleVote = async () => {
    if (
      !config?.vote_storage_fee ||
      preSelectedVote === undefined ||
      !proposal?.snapshot_and_state?.snapshot.block_height ||
      !proof
    ) {
      toast.error("Unable to cast vote: missing data");
      return;
    }

    try {
      await castVote({
        proposalId: proposal.id,
        voteIndex: preSelectedVote,
        blockId: proposal.snapshot_and_state.snapshot.block_height,
        voteStorageFee: config.vote_storage_fee,
        proof,
      });
      closeDialog();
    } catch (error) {
      console.error(`Error casting vote: ${error}`);
      // Toast is handled by hook or global error handler usually, but we can add one here if needed
      toast.error("Failed to cast vote");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="text-red-500 font-medium">Error: {error}</div>
        <UpdatedButton onClick={closeDialog} type="secondary">
          Close
        </UpdatedButton>
      </div>
    );
  }

  // Loading state for proof
  if (isLoadingProof) {
    return (
      <div className="flex flex-col w-full items-center justify-center p-8 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="text-secondary text-sm">Preparing vote transaction...</div>
      </div>
    );
  }

  // Ready to sign state
  return (
    <div className="flex flex-col w-full gap-6 p-1">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-primary">Confirm Vote</h2>
        <p className="text-secondary">
          Please confirm your vote for option{" "}
          <span className="font-bold text-primary">
            {proposal.voting_options[preSelectedVote!] || "Unknown"}
          </span>
          .
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <UpdatedButton
          onClick={handleVote}
          isLoading={isVoting}
          className="w-full"
        >
          Sign & Vote
        </UpdatedButton>
        <UpdatedButton
          onClick={closeDialog}
          type="secondary"
          className="w-full"
          disabled={isVoting}
        >
          Cancel
        </UpdatedButton>
      </div>
    </div>
  );
}

export const NearVoteDialog = memo(NearVoteDialogComponent);

