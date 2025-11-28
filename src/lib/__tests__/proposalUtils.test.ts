import { isQuorumFulfilled, getProposalStatus, getTotalVotes } from "../proposalUtils";
import { ProposalDisplayStatus, ProposalStatus } from "../contracts/types/voting";

describe("proposalUtils", () => {
  describe("getTotalVotes", () => {
    it("should sum for, against, and abstain votes", () => {
      const total = getTotalVotes("100", "50", "25");
      expect(total.toString()).toBe("175");
    });
  });

  describe("isQuorumFulfilled", () => {
    it("should return true when total votes (including abstain) meet quorum", () => {
      const result = isQuorumFulfilled({
        quorumAmount: "200",
        forVotingPower: "100",
        againstVotingPower: "50",
        abstainVotingPower: "50",
      });
      expect(result).toBe(true);
    });

    it("should return false when total votes (including abstain) do not meet quorum", () => {
      const result = isQuorumFulfilled({
        quorumAmount: "201",
        forVotingPower: "100",
        againstVotingPower: "50",
        abstainVotingPower: "50",
      });
      expect(result).toBe(false);
    });
  });

  describe("getProposalStatus", () => {
    it("should return Succeeded when quorum is met (with abstain) and for > against", () => {
      const status = getProposalStatus({
        status: ProposalStatus.Finished,
        quorumAmount: "200",
        forVotingPower: "100",
        againstVotingPower: "50",
        abstainVotingPower: "50",
      });
      expect(status).toBe(ProposalDisplayStatus.Succeeded);
    });

    it("should return Defeated when quorum is NOT met even with abstain", () => {
      const status = getProposalStatus({
        status: ProposalStatus.Finished,
        quorumAmount: "201",
        forVotingPower: "100",
        againstVotingPower: "50",
        abstainVotingPower: "50",
      });
      expect(status).toBe(ProposalDisplayStatus.Defeated);
    });

    it("should return Defeated when quorum is met but for <= against", () => {
      const status = getProposalStatus({
        status: ProposalStatus.Finished,
        quorumAmount: "200",
        forVotingPower: "50",
        againstVotingPower: "100",
        abstainVotingPower: "50",
      });
      expect(status).toBe(ProposalDisplayStatus.Defeated);
    });
  });
});
