import { Proposal } from "@/lib/api/proposal/types";
import { formatVotingPower } from "@/lib/utils";
import { NEAR_TOKEN } from "@/lib/constants";
import Big from "big.js";

export default function ProposalStatus({ proposal }: { proposal: Proposal }) {
  const forVotes = proposal.forVotingPower;
  const againstVotes = proposal.againstVotingPower;
  const abstainVotes = proposal.abstainVotingPower;
  const totalVotes = Big(proposal.forVotingPower)
    .plus(proposal.againstVotingPower)
    .plus(proposal.abstainVotingPower)
    .toFixed();

  // Convert yocto NEAR to NEAR for display
  const forVotesNumber = Number(forVotes) / Math.pow(10, NEAR_TOKEN.decimals);
  const againstVotesNumber =
    Number(againstVotes) / Math.pow(10, NEAR_TOKEN.decimals);

  // Format both values independently
  const formattedForVotes = formatVotingPower(forVotesNumber, forVotesNumber);
  const formattedAgainstVotes = formatVotingPower(
    againstVotesNumber,
    againstVotesNumber
  );

  return (
    <div className="flex flex-col items-end gap-1 justify-center">
      <div className="flex flex-row space-between text-primary gap-1">
        <div>{formattedForVotes} For</div>
        <div>–</div>
        <div>{formattedAgainstVotes} Against</div>
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
