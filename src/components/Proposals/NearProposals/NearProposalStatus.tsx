import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { ProposalInfo } from "@/lib/contracts/types/voting";

export default function NearProposalStatus({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const forVotes = proposal.votes[0].total_venear;
  const againstVotes = proposal.votes[1].total_venear;
  const totalVotes = proposal.total_votes.total_venear;

  return (
    <div className="flex flex-col items-end gap-1 justify-center">
      <div className="flex flex-row space-between text-primary gap-1">
        <div>
          <NearTokenAmount amount={forVotes} hideCurrency />
          {proposal.voting_options[0]}
        </div>
        <div>–</div>
        <div>
          <NearTokenAmount amount={againstVotes} hideCurrency />
          {proposal.voting_options[1]}
        </div>
      </div>
      {totalVotes !== "0" && (
        <div className="flex w-52 h-1 bg-wash rounded-full">
          <div
            className=" bg-positive h-1 rounded-l-full"
            style={{
              width: `${(Number(forVotes) / Number(totalVotes)) * 100}%`,
            }}
          ></div>
          <div
            className=" bg-negative h-1 rounded-r-full"
            style={{
              width: `${(Number(againstVotes) / Number(totalVotes)) * 100}%`,
            }}
          ></div>
        </div>
      )}

      {totalVotes === "0" && (
        <div className="flex w-52 h-1 bg-wash rounded-full">
          <div className=" bg-tertiary h-1" style={{ width: `100%` }}></div>
        </div>
      )}
    </div>
  );
}
