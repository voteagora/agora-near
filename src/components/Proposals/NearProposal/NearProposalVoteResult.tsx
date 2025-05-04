"use client";

import { UpdatedButton } from "@/components/Button";
import { useOpenDialog } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { useState } from "react";
import NearProposalVoteFilter from "./NearProposalVoteFilter";
import NearProposalVoteSummary from "./NearProposalVoteSummary";
import NearProposalVotingActions from "./NearProposalVotingActions";

const NearProposalVoteResult = ({
  proposal,
  config,
}: {
  proposal: ProposalInfo;
  config: VotingConfig;
}) => {
  const [showVoters, setShowVoters] = useState(true);
  const openDialog = useOpenDialog();

  const handleOpenLockDialog = () => {
    openDialog({
      type: "NEAR_LOCK",
      params: {},
    });
  };

  return (
    <div
      className={`fixed flex justify-between gap-4 sm:sticky top-[auto] sm:top-20 sm:max-h-[calc(100vh-162px)] sm:w-[24rem] w-[calc(100%-32px)] max-h-[calc(100%-190px)] items-stretch flex-shrink max-w-[24rem] bg-neutral border border-line rounded-xl shadow-newDefault mb-8 transition-all`}
      style={{
        transition: "bottom 600ms cubic-bezier(0, 0.975, 0.015, 0.995)",
      }}
    >
      <div className="flex flex-col gap-4 min-h-0 shrink pt-4 w-full">
        <div className="flex flex-col gap-4">
          <div className="font-semibold px-4 text-primary">Voting activity</div>
          <NearProposalVoteSummary proposal={proposal} />
          <div className="px-4 pb-4">
            <NearProposalVoteFilter
              initialSelection={showVoters ? "Voters" : "Hasn't voted"}
              onSelectionChange={(value) => {
                setShowVoters(value === "Voters");
              }}
            />
          </div>
          <NearProposalVotingActions proposal={proposal} config={config} />
          <div className="px-4 pb-4">
            <UpdatedButton
              type="secondary"
              className="w-full"
              onClick={handleOpenLockDialog}
            >
              Lock NEAR
            </UpdatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearProposalVoteResult;
