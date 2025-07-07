"use client";

import { Button } from "@/components/ui/button";
import { useNear } from "@/contexts/NearContext";
import { useCastVote } from "@/hooks/useCastVote";
import { useVotingPower } from "@/hooks/useVotingPower";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { useState } from "react";
import toast from "react-hot-toast";
import { LoadingVote } from "./NearVoteDialog";
import NearTokenAmount from "../shared/NearTokenAmount";
import { RadioButton } from "../ui/radio-button";
import { Skeleton } from "../ui/skeleton";
import { capitalizeFirstLetter } from "@/lib/utils";

export function NearVoteOptionsDialog({
  proposal,
  config,
  closeDialog,
}: {
  proposal: ProposalInfo;
  config: VotingConfig;
  closeDialog: () => void;
}) {
  const { signedAccountId } = useNear();
  const { castVote, isVoting, error: votingError } = useCastVote({});
  const [selectedOption, setSelectedOption] = useState<number>();

  const { data: votingPower } = useVotingPower(signedAccountId);

  const handleVote = async () => {
    if (
      !config?.vote_storage_fee ||
      selectedOption === undefined ||
      !proposal?.snapshot_and_state?.snapshot.block_height
    ) {
      toast.error(`Something went wrong`);
      return;
    }

    try {
      await castVote({
        proposalId: proposal.id,
        voteIndex: selectedOption,
        blockId: proposal.snapshot_and_state.snapshot.block_height,
        voteStorageFee: config.vote_storage_fee,
      });
      closeDialog();
    } catch (error) {
      console.error(`Error casting vote: ${error}`);
    }
  };

  if (isVoting) {
    return <LoadingVote />;
  }

  return (
    <div
      className="flex flex-col gap-4 w-full relative"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex flex-col">
        <div className="text-xs text-tertiary font-medium">
          {signedAccountId}
        </div>
        <p className="text-xl font-extrabold">Select an option</p>
      </div>
      <div className="flex flex-col max-h-[46vh] overflow-y-scroll">
        {proposal.voting_options.map((option, index) => (
          <RadioButton
            key={index}
            title={option}
            checked={selectedOption === index}
            onClick={() => setSelectedOption(index)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between items-stretch">
          <Button onClick={handleVote} disabled={selectedOption === undefined}>
            {selectedOption !== undefined ? (
              <>
                {`Vote ${capitalizeFirstLetter(
                  proposal.voting_options[selectedOption].toLowerCase()
                )} with`}
                {"\u00A0"}
                {votingPower ? (
                  <NearTokenAmount amount={votingPower} currency="veNEAR" />
                ) : (
                  <Skeleton className="w-4 h-4" />
                )}
              </>
            ) : (
              "Select an option"
            )}
          </Button>
        </div>
        {votingError && (
          <p className="text-red-500 text-sm">{votingError.message}</p>
        )}
      </div>
    </div>
  );
}
