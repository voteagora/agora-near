import { ProposalInfo } from "@/lib/contracts/types/voting";

export default function NearProposalVoteBar({ proposal }: {
  proposal: ProposalInfo
}) {
  const hasVotes = proposal.total_votes.total_venear !== '0';

  const forVotes = Number(proposal.votes[0].total_venear);
  const againstVotes = Number(proposal.votes[1].total_venear);
  const totalVotes = Number(proposal.total_votes.total_venear);

  return (
    <div id="chartContainer" className="relative flex items-stretch gap-x-0.5">
      {hasVotes ? (
        <>
          {forVotes > 0 && (
            <div
              style={{ flex: forVotes / totalVotes }}
              className="min-w-[1px] bg-positive h-[10px]"
            ></div>
          )}
          {againstVotes > 0 && (
            <div
              style={{ flex: againstVotes / totalVotes }}
              className="min-w-[1px] bg-negative h-[10px]"
            ></div>
          )}
        </>
      ) : (
        <div className="w-full bg-wash h-[10px]"></div>
      )}
    </div>
  );
}
