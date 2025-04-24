import { ProposalInfo } from "@/lib/contracts/types/voting";
import { TokenAmountDisplay } from "@/lib/utils";

export default function NearProposalStatus({ proposal }: { proposal: ProposalInfo }) {
  const forLength = proposal.votes[0].total_venear;
  const againstLength = proposal.votes[1].total_venear

  const totalLength = proposal.total_votes.total_venear;

  return (
    <div className="flex flex-col items-end gap-1 justify-center">
      <div className="flex flex-row space-between text-primary gap-1">
        <div>
          {TokenAmountDisplay({
            amount: proposal.votes[0].total_venear,
            currency: "",
          })}{" "}
          For
        </div>
        <div>–</div>
        <div>
          {TokenAmountDisplay({
            amount: proposal.votes[1].total_venear,
            currency: "",
          })}{" "}
          Against
        </div>
      </div>

      {totalLength !== '0' && (
        <div className="flex w-52 h-1 bg-wash rounded-full">
          <div
            className=" bg-positive h-1 rounded-l-full"
            style={{ width: `${(Number(forLength) / Number(totalLength)) * 100}%` }}
          ></div>
          <div
            className=" bg-negative h-1 rounded-r-full"
            style={{ width: `${(Number(againstLength) / Number(totalLength)) * 100}%` }}
          ></div>
        </div>
      )}

      {totalLength === '0' && (
        <div className="flex w-52 h-1 bg-wash rounded-full">
          <div className=" bg-tertiary h-1" style={{ width: `100%` }}></div>
        </div>
      )}
    </div>
  );
}
