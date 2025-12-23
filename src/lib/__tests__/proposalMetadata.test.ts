import { describe, it, expect } from "vitest";
import {
  encodeMetadata,
  decodeMetadata,
  ProposalType,
  METADATA_PREFIX,
  METADATA_VERSION,
  APPROVAL_THRESHOLD_BASIS_POINTS,
} from "../proposalMetadata";
import { DEFAULT_QUORUM_THRESHOLD_PERCENTAGE_BPS } from "../constants";
describe("proposalMetadata", () => {
  describe("encodeMetadata", () => {
    it("should encode metadata into description using binary prefix and suffix", () => {
      const description = "My Proposal";
      const metadata = {
        proposalType: ProposalType.SuperMajority,
        version: 1,
        quorum: DEFAULT_QUORUM_THRESHOLD_PERCENTAGE_BPS,
        approvalThreshold: APPROVAL_THRESHOLD_BASIS_POINTS.SUPER_MAJORITY,
      };
      const result = encodeMetadata(description, metadata);
      // Check Prefix (4 bytes)
      expect(result.startsWith(METADATA_PREFIX)).toBe(true);
      // Check Version (2 bytes after prefix)
      expect(result.slice(4, 6)).toBe(METADATA_VERSION);
      // Check Description
      expect(result).toContain("My Proposal");
      // Check Suffix with numeric threshold (Basis Points)
      // SuperMajority = 2/3 = 0.666666... * 10000 = 6667
      expect(result).toContain("approval_threshold=6667");
    });
    it("should append metadata for Standard type", () => {
      const result = encodeMetadata("Desc", {
        proposalType: ProposalType.SimpleMajority,
        version: 1,
        quorum: DEFAULT_QUORUM_THRESHOLD_PERCENTAGE_BPS,
        approvalThreshold: APPROVAL_THRESHOLD_BASIS_POINTS.SIMPLE_MAJORITY,
      });
      expect(result).toContain("Desc");
      // Should still include prefix? Implementation says yes: `${METADATA_PREFIX}...${suffix}`
      // Suffix will be empty if Standard.
      expect(result.startsWith(METADATA_PREFIX)).toBe(true);
      expect(result).toContain("approval_threshold=5000,quorum=3500");
    });
  });
  describe("decodeMetadata", () => {
    it("should decode numeric threshold (SuperMajority)", () => {
      const description = "Body";
      const encoded = `${METADATA_PREFIX}${METADATA_VERSION}${description}|approval_threshold=6667`;
      const { metadata, description: cleanDesc } = decodeMetadata(encoded);
      expect(cleanDesc).toBe(description);
      // We no longer set approvalThreshold in the metadata object to avoid confusion with absolute vote counts in downstream logic
      // expect(metadata?.approvalThreshold).toBe(0.6667);
      expect(metadata?.proposalType).toBe(ProposalType.SuperMajority);
    });
    it("should decode numeric threshold (SimpleMajority)", () => {
      const description = "Body";
      const encoded = `${METADATA_PREFIX}${METADATA_VERSION}${description}|approval_threshold=5000`;
      const { metadata, description: cleanDesc } = decodeMetadata(encoded);
      expect(cleanDesc).toBe(description);
      expect(metadata?.proposalType).toBe(ProposalType.SimpleMajority);
    });
    it("should default to simple majority if null metadata for plain text", () => {
      const description = "Just text";
      const { metadata, description: cleanDesc } = decodeMetadata(description);
      expect(metadata?.proposalType).toBe(ProposalType.SimpleMajority);
      expect(cleanDesc).toBe(description);
    });
    it("should default to simpler majority for v0 descriptions (no prefix)", () => {
      const description = "Just a plain old proposal description";
      const { metadata, description: cleanDesc } = decodeMetadata(description);
      expect(metadata?.proposalType).toBe(ProposalType.SimpleMajority);
      expect(cleanDesc).toBe(description);
    });
    it("should default to simple majority if pipe but no prefix", () => {
      const description = "This is a pipe | character";
      const { metadata, description: cleanDesc } = decodeMetadata(description);
      expect(metadata?.proposalType).toBe(ProposalType.SimpleMajority);
      expect(cleanDesc).toBe(description);
    });
    it("should default to simple majority if version mismatch", () => {
      const invalidVersion = "\u0001\u0002"; // Invalid version
      const encoded = `${METADATA_PREFIX}${invalidVersion}Content|approval_threshold=6667`;
      const { metadata, description: cleanDesc } = decodeMetadata(encoded);
      expect(metadata?.proposalType).toBe(ProposalType.SimpleMajority);
      expect(cleanDesc).toBe(cleanDesc);
    });
  });
});
