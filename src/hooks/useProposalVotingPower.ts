import { ProposalInfo } from "@/lib/contracts/types/voting";
import { useVotingPower } from "./useVotingPower";

export const useProposalVotingPower = ({
  accountId,
  proposal,
}: {
  accountId?: string;
  proposal: ProposalInfo;
}) => {
  const blockHeight = proposal.snapshot_and_state?.snapshot.block_height;

  const { data: votingPower, isLoading } = useVotingPower(
    accountId,
    blockHeight
  );

  return {
    votingPower,
    isLoading,
  };
};
