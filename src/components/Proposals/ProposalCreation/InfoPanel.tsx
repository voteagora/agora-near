import { VStack } from "@/components/Layout/Stack";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { VotingConfig } from "@/lib/contracts/types/voting";
import { convertNanoSecondsToDays } from "@/lib/utils";
import Big from "big.js";

type InfoPanelProps = {
  votingConfig: VotingConfig;
};

export default function InfoPanel({ votingConfig }: InfoPanelProps) {
  const votingDays = convertNanoSecondsToDays(votingConfig.voting_duration_ns);
  const votingDuration = `${votingDays} ${votingDays === 1 ? "day" : "days"}`;
  const totalDeposit = Big(votingConfig.base_proposal_fee)
    .plus(Big(votingConfig.vote_storage_fee))
    .toFixed();

  return (
    <VStack className="bg-wash rounded-xl border border-line p-6">
      <h2 className="text-2xl font-extrabold mb-4 text-primary">
        Proposal Guide
      </h2>
      <div className="flex flex-col gap-4">
        <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-2">
          <li>
            Proposals must adhere to the style guide and be approved by the
            Screening Committee.
          </li>
          <li>Once approved, voting will be open for {votingDuration}.</li>
          <li>
            Creating a proposal requires a minimum deposit of{" "}
            <NearTokenAmount amount={totalDeposit} minimumFractionDigits={2} />.
          </li>
        </ul>
      </div>
    </VStack>
  );
}
