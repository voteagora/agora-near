import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { Proposal } from "@/lib/api/proposal/types";
import Big from "big.js";

export default function NearProposalStatus({
  proposal,
}: {
  proposal: Proposal;
}) {
  const forVotes = proposal.forVotingPower;
  const againstVotes = proposal.againstVotingPower;
  const abstainVotes = proposal.abstainVotingPower;
  const totalVotes = Big(proposal.forVotingPower)
    .plus(proposal.againstVotingPower)
    .plus(proposal.abstainVotingPower)
    .toFixed();

  return (
    <div className="flex flex-col items-end gap-1 justify-center">
      <div className="flex flex-row space-between text-primary gap-1">
        <div>
          <NearTokenAmount amount={forVotes} hideCurrency />
          For
        </div>
        <div>–</div>
        <div>
          <NearTokenAmount amount={againstVotes} hideCurrency />
          Against
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
            className=" bg-secondary h-1 rounded-l-full"
            style={{
              width: `${(Number(abstainVotes) / Number(totalVotes)) * 100}%`,
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
