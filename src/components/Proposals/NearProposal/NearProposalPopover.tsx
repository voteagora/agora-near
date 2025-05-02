import { ProposalInfo } from "@/lib/contracts/types/voting";
import NearProposalVoteBar from "./NearProposalVoteBar";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { getNearProposalTimes, getNearQuorum } from "@/lib/nearProposalUtils";

const NearProposalPopover = ({ proposal }: { proposal: ProposalInfo }) => {
  const { createdTime, startTime, endTime } = getNearProposalTimes(proposal);

  return (
    <div className="flex flex-col font-inter font-semibold text-xs w-full max-w-[317px] sm:min-w-[317px] bg-wash">
      <NearProposalVoteBar proposal={proposal} />
      <div className="flex flex-col gap-2 w-full mt-4">
        <div className="flex justify-between text-positive">
          FOR{" "}
          <AmountAndPercent
            amount={proposal.votes[0].total_venear}
            total={proposal.total_votes.total_venear}
          />
        </div>
        <div className="text-negative flex justify-between">
          AGAINST{" "}
          <AmountAndPercent
            amount={proposal.votes[1].total_venear}
            total={proposal.total_votes.total_venear}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-[calc(100%+32px)] mt-4 bg-wash border-t border-b border-line -ml-4 p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-secondary font-semibold text-xs">
            Quorum
          </div>
          <div className="flex items-center gap-1 ">
            <p className="text-xs font-semibold text-secondary">
              <NearTokenAmount
                amount={proposal.votes[0].total_venear}
                hideCurrency
              />{" "}
              /{" "}
              <NearTokenAmount
                amount={getNearQuorum(proposal).toString()}
                hideCurrency
              />
              Required
            </p>
          </div>
        </div>
      </div>
      <ol className="overflow-hidden space-y-6 w-[calc(100%+32px)] bg-wash -ml-4 p-4 pb-6 rounded-br-lg rounded-bl-lg">
        {createdTime && (
          <StepperRow label="Proposal created" value={createdTime} />
        )}
        {startTime && (
          <StepperRow label="Voting period start" value={startTime} />
        )}
        {endTime && (
          <StepperRow label="Voting period end" value={endTime} isLastStep />
        )}
      </ol>
    </div>
  );
};

export default NearProposalPopover;

function AmountAndPercent({
  amount,
  total,
}: {
  amount: string;
  total: string;
}) {
  const percent = total
    ? ((Number(amount) / Number(total)) * 100).toFixed(2)
    : undefined;
  return (
    <span>
      <NearTokenAmount amount={amount} hideCurrency />
      {percent && `(${percent}%)`}
    </span>
  );
}

const StepperRow = ({
  label,
  value,
  isActive,
  isCompleted,
  isLastStep,
}: {
  label: string;
  value: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isLastStep?: boolean;
}) => {
  return (
    <li
      className={`relative flex-1  ${!isLastStep && "after:content-[''] after:w-[1.5px] after:h-[35px]  after:bg-line after:inline-block after:absolute after:top-3 after:left-0.5"} `}
    >
      <div className="flex items-center gap-x-3">
        <div
          className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-black" : isActive ? "bg-blue-600" : "bg-primary/30"}`}
        />

        <div className="w-full flex items-center justify-between text-xs font-semibold">
          <div
            className={`${isCompleted ? "text-primary" : isActive ? "text-blue-600" : "text-secondary"} flex items-center gap-x-1`}
          >
            {label}
          </div>

          <p className="text-xs font-medium text-secondary">{value}</p>
        </div>
      </div>
    </li>
  );
};
