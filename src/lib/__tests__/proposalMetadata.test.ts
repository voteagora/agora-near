import { describe, it, expect } from "vitest";
import {
  encodeMetadata,
  decodeMetadata,
  ProposalType,
} from "../proposalMetadata";

describe("proposalMetadata", () => {
  describe("encodeMetadata", () => {
    it("should encode metadata into a description using JSON block", () => {
      const description = "This is a proposal.";
      const metadata = {
        proposalType: ProposalType.Standard,
      };

      const result = encodeMetadata(description, metadata);
      expect(result).toContain('"proposalType": "Standard"');
      expect(result).toContain("This is a proposal.");
      expect(result).toContain("```json:metadata");
    });

    it("should replace existing metadata block", () => {
      const description =
        'Original description\n\n```json:metadata\n{"proposalType": "Old"}\n```';
      const metadata = {
        proposalType: ProposalType.SuperMajority,
        quorumThreshold: 100,
      };

      const result = encodeMetadata(description, metadata);
      expect(result).toContain('"proposalType": "SuperMajority"');
      expect(result).toContain('"quorumThreshold": 100');
      expect(result).not.toContain('"proposalType": "Old"');
      expect(result).toContain("Original description");
    });
  });

  describe("decodeMetadata", () => {
    it("should decode metadata from a description", () => {
      const description = `My Proposal body
      
\`\`\`json:metadata
{
  "proposalType": "SuperMajority",
  "quorumThreshold": 500
}
\`\`\``;

      const { metadata, description: cleanDescription } =
        decodeMetadata(description);

      expect(metadata).toEqual({
        proposalType: ProposalType.SuperMajority,
        quorumThreshold: 500,
      });
      expect(cleanDescription).toBe("My Proposal body");
    });

    it("should return null metadata if no block exists", () => {
      const description = "Just a plain description";
      const { metadata, description: cleanDescription } =
        decodeMetadata(description);

      expect(metadata).toBeNull();
      expect(cleanDescription).toBe(description);
    });

    it("should handle malformed json gracefully", () => {
      const description = `Body
        
\`\`\`json:metadata
{
  "invalid": json:
}
\`\`\``;

      const { metadata } = decodeMetadata(description);

      expect(metadata).toBeNull();
    });
  });
});
