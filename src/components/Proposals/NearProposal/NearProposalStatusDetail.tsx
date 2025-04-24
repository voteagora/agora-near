import { ProposalInfo } from "@/lib/contracts/types/voting";
import NearProposalTimeStatus from "./NearProposalTimeStatus";

export default function NearProposalStatusDetail({
  proposal
}: {
  proposal: ProposalInfo
}) {
  return (
    <div className="flex flex-row justify-between items-center gap-4 bg-wash border-t border-line -mx-4 px-4 py-2 text-secondary rounded-b-md text-xs">
      <div>
        {proposal.status === "Created" && (
          <p className="text-blue-600 bg-sky-200 rounded-sm px-1 py-0.5 font-semibold">
            CREATED
          </p>
        )}
        {proposal.status === "Finished" && (
          <p className="text-green-600 bg-green-200 rounded-sm px-1 py-0.5 font-semibold">
            FINISHED
          </p>
        )}
      </div>
      <div>
        <NearProposalTimeStatus proposal={proposal} />
      </div>
    </div>
  );
}
