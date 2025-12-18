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
      // Check Suffix
      expect(result).toContain("|proposal_type=SuperMajority");
    });

    it("should decode binary metadata correctly", () => {
      const description = "My Proposal Body";
      const encoded = `${METADATA_PREFIX}${METADATA_VERSION}${description}|proposal_type=SimpleMajority`;

      const { metadata, description: cleanDesc } = decodeMetadata(encoded);

      expect(cleanDesc).toBe(description);
      expect(metadata).toEqual({
        proposalType: ProposalType.SimpleMajority,
      });
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
