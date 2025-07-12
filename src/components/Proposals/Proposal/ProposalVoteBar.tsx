import { VOTING_THRESHOLDS } from "@/lib/constants";
import { ProposalInfo } from "@/lib/contracts/types/voting";

export default function ProposalVoteBar({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const hasVotes = proposal.total_votes.total_venear !== "0";

  const forVotes = Number(proposal.votes[0].total_venear);
  const againstVotes = Number(proposal.votes[1].total_venear);
  const abstainVotes = Number(proposal.votes[2]?.total_venear ?? "0");
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
          {abstainVotes > 0 && (
            <div
              style={{ flex: abstainVotes / totalVotes }}
              className="min-w-[1px] bg-secondary h-[10px]"
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
      <div
        className="bg-primary h-4 w-[2px] absolute -top-[3px] z-50"
        style={{ left: `${VOTING_THRESHOLDS.SIMPLE_MAJORITY}%` }} // Assume simple majority for now
      />
    </div>
  );
}
