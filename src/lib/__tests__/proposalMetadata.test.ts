import { describe, it, expect } from "vitest";
import {
  encodeMetadata,
  decodeMetadata,
  ProposalType,
  METADATA_PREFIX,
  METADATA_VERSION,
} from "../proposalMetadata";

describe("proposalMetadata", () => {
  describe("encodeMetadata", () => {
    it("should encode metadata into description using binary prefix and suffix", () => {
      const description = "My Proposal";
      const metadata = {
        proposalType: ProposalType.SuperMajority,
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

    it("should not append metadata for Standard type", () => {
      const result = encodeMetadata("Desc", {
        proposalType: ProposalType.Standard,
      });
      expect(result).toContain("Desc");
      // Should still include prefix? Implementation says yes: `${METADATA_PREFIX}...${suffix}`
      // Suffix will be empty if Standard.
      expect(result.startsWith(METADATA_PREFIX)).toBe(true);
      expect(result).not.toContain("|");
    });
  });

  describe("decodeMetadata", () => {
    it("should decode numeric threshold (SuperMajority)", () => {
      const description = "Body";
      const encoded = `${METADATA_PREFIX}${METADATA_VERSION}${description}|approval_threshold=6700`;

      const { metadata, description: cleanDesc } = decodeMetadata(encoded);

      expect(cleanDesc).toBe(description);
      expect(metadata?.approvalThreshold).toBe(0.67);
      expect(metadata?.proposalType).toBe(ProposalType.SuperMajority);
    });

    it("should decode numeric threshold (SimpleMajority)", () => {
      const description = "Body";
      const encoded = `${METADATA_PREFIX}${METADATA_VERSION}${description}|approval_threshold=5100`;

      const { metadata, description: cleanDesc } = decodeMetadata(encoded);

      expect(cleanDesc).toBe(description);
      expect(metadata?.approvalThreshold).toBe(0.51);
      expect(metadata?.proposalType).toBe(ProposalType.SimpleMajority);
    });

    it("should return null metadata for plain text", () => {
      const description = "Just text";
      const { metadata, description: cleanDesc } = decodeMetadata(description);

      expect(metadata).toBeNull();
      expect(cleanDesc).toBe(description);
    });

    it("should fallback to legacy labels if present", () => {
      const description = "Body";
      const encoded = `${METADATA_PREFIX}${METADATA_VERSION}${description}|proposal_type=SuperMajority`;
      const { metadata } = decodeMetadata(encoded);
      expect(metadata?.proposalType).toBe(ProposalType.SuperMajority);
    });

    it("should return null metadata for legacy descriptions (no prefix)", () => {
      const description = "Just a plain old proposal description";
      const { metadata, description: cleanDesc } = decodeMetadata(description);

      expect(metadata).toBeNull();
      expect(cleanDesc).toBe(description);
    });

    it("should handle description with pipe but no prefix", () => {
      const description = "This is a pipe | character";
      const { metadata, description: cleanDesc } = decodeMetadata(description);

      expect(metadata).toBeNull();
      expect(cleanDesc).toBe(description);
    });

    it("should ignore metadata if version mismatch", () => {
      const invalidVersion = "\u0001\u0002"; // Invalid version
      const encoded = `${METADATA_PREFIX}${invalidVersion}Content|proposal_type=SuperMajority`;
      const { metadata, description: cleanDesc } = decodeMetadata(encoded);

      expect(metadata).toBeNull();
      expect(cleanDesc).toBe(encoded);
    });
  });
});
