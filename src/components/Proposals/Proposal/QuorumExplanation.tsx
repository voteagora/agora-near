import TokenAmount from "@/components/shared/TokenAmount";
import {
  getQuorumFloorYoctoNear,
  getQuorumOverrideYoctoNear,
  getFormattedQuorumPercentage,
  getIsQuorumOverrideActive,
} from "@/lib/proposalUtils";
import { memo, useMemo } from "react";

export const QuorumExplanation = memo(() => {
  const isOverrideActive = useMemo(() => getIsQuorumOverrideActive(), []);
  const quorumOverrideAmount = useMemo(() => getQuorumOverrideYoctoNear(), []);

  const quorumFloorAmount = useMemo(() => getQuorumFloorYoctoNear(), []);

  return isOverrideActive ? (
    <>
      {`Even though quorum is not modeled onchain in House of Stake v1, the community has decided that proposals must meet a minimum quorum requirement of`}{" "}
      <TokenAmount
        amount={quorumOverrideAmount}
        currency="veNEAR"
        trailingSpace={false}
        maximumSignificantDigits={0}
        minimumFractionDigits={0}
      />{" "}
      {`to be considered passed.`}
    </>
  ) : (
    <>
      {`Even though quorum is not modeled onchain in House of Stake v1, the community has decided that proposals must meet a minimum quorum requirement to be considered passed. The quorum is calculated as the higher of either ${getFormattedQuorumPercentage()} of total veNEAR supply or an absolute floor of`}{" "}
      <TokenAmount
        amount={quorumFloorAmount}
        currency="veNEAR"
        trailingSpace={false}
        maximumSignificantDigits={0}
        minimumFractionDigits={0}
      />
      {"."}
    </>
  );
});

QuorumExplanation.displayName = "QuorumExplanation";
