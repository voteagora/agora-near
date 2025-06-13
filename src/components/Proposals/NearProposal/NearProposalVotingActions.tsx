"use client";

import { RegisterToVoteButton } from "@/components/AccountActions/RegisterToVoteButton";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNear } from "@/contexts/NearContext";
import { useCheckVoterStatus } from "@/hooks/useCheckVoterStatus";
import { CHART_DATA_QK } from "@/hooks/useNearProposalChartData";
import { VOTES_QK } from "@/hooks/useNearProposalVotes";

import { useProposalVotingPower } from "@/hooks/useProposalVotingPower";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export default function NearProposalVotingActions({
  proposal,
  config,
}: {
  proposal: ProposalInfo;
  config: VotingConfig;
}) {
  const { signedAccountId } = useNear();
  const openDialog = useOpenDialog();
  const { signIn } = useNear();
  const [selectedVote, setSelectedVote] = useState<number>();
  const { votingPower, isLoading: isLoadingVotingPower } =
    useProposalVotingPower({
      proposal,
      accountId: signedAccountId,
    });

  const { isRegisteredToVote } = useCheckVoterStatus({
    enabled: !!signedAccountId,
  });

  const queryClient = useQueryClient();

  const handleOpenTwoOptionVoteDialog = useCallback(() => {
    openDialog({
      type: "NEAR_VOTE",
      params: {
        proposal,
        config,
        preSelectedVote: selectedVote,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [VOTES_QK, String(proposal.id)],
          });

          queryClient.invalidateQueries({
            queryKey: [CHART_DATA_QK, String(proposal.id)],
          });
        },
      },
    });
  }, [openDialog, proposal, config, selectedVote, queryClient]);

  if (!signedAccountId) {
    return (
      <div className="flex flex-col justify-between py-3 px-3 border-t border-line">
        <Button className="w-full" onClick={signIn}>
          Connect wallet to vote
        </Button>
      </div>
    );
  }

  if (proposal.status !== "Voting") {
    return (
      <div className="flex flex-col justify-between py-3 px-3 border-t border-line">
        <Button className="w-full" disabled>
          Not open to voting
        </Button>
      </div>
    );
  }

  if (!isRegisteredToVote) {
    return (
      <div className="flex flex-col justify-between py-3 px-3 border-t border-line">
        <RegisterToVoteButton />
      </div>
    );
  }

  const handleOpenMultiOptionVoteDialog = () => {
    openDialog({
      type: "NEAR_VOTE_OPTIONS",
      params: {
        proposal,
        config,
      },
    });
  };

  // For multiple options, show the dialog button
  if (proposal.voting_options.length !== 2) {
    return (
      <div className="flex flex-col justify-between py-3 px-3 border-t border-line">
        <Button className="w-full" onClick={handleOpenMultiOptionVoteDialog}>
          Cast vote
        </Button>
      </div>
    );
  }

  // For 2 options, show inline voting buttons
  return (
    <div className="flex flex-col gap-3 py-3 px-3 border-t border-line">
      <div className="flex flex-row gap-2">
        {proposal.voting_options.map((option, index) => {
          const isFor = index === 0;
          const isSelected = selectedVote === index;
          const selectedStyle = isSelected
            ? isFor
              ? "border-positive bg-positive/10"
              : "border-negative bg-negative/10"
            : "bg-neutral";

          return (
            <button
              key={index}
              className={`${
                isFor ? "text-positive" : "text-negative"
              } ${selectedStyle} rounded-md border border-line text-sm font-medium cursor-pointer py-2 px-3 transition-all hover:bg-wash active:shadow-none disabled:bg-line disabled:text-secondary h-8 capitalize flex items-center justify-center flex-1`}
              onClick={() => setSelectedVote(index)}
            >
              {option.toLowerCase()}
            </button>
          );
        })}
      </div>
      <Button
        onClick={handleOpenTwoOptionVoteDialog}
        className="w-full"
        disabled={selectedVote === undefined}
      >
        {selectedVote !== undefined ? (
          <>
            Vote{" "}
            {capitalizeFirstLetter(
              proposal.voting_options[selectedVote].toLowerCase()
            )}{" "}
            with
            {"\u00A0"}
            {!isLoadingVotingPower ? (
              <NearTokenAmount
                amount={votingPower.toFixed()}
                currency="veNEAR"
              />
            ) : (
              <Skeleton className="w-8 h-4 inline-block" />
            )}
          </>
        ) : (
          "Select an option"
        )}
      </Button>
    </div>
  );
}
