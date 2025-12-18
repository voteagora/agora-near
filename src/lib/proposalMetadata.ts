/**
 * Supported proposal types.
 * 'Standard' uses the contract default.
 * 'Tactical' allows overriding quorum/thresholds via metadata.
 */
export enum ProposalType {
  Standard = "Standard",
  SimpleMajority = "SimpleMajority",
  SuperMajority = "SuperMajority",
}

export interface ProposalMetadataConfig {
  proposalType?: ProposalType;
  // Optional override for quorum threshold
  quorumThreshold?: number;
  // Optional override for approval threshold
  approvalThreshold?: number;
}

// Postgres TEXT columns do not support NULL bytes (\x00).
// We use Record Separator (\x1E) as a safe alternative.
export const METADATA_PREFIX = "\u001E\u001E\u001E\u001E";
// Version 1: \u0001\u0001 (Avoids \x00)
export const METADATA_VERSION = "\u0001\u0001";
const THRESHOLD_PRECISION = 10000;

export const PROPOSAL_APPROVAL_THRESHOLDS: Record<ProposalType, number> = {
  [ProposalType.Standard]: 0.5,
  [ProposalType.SimpleMajority]: 0.5,
  [ProposalType.SuperMajority]: 2 / 3,
};

export function getApprovalThreshold(type?: ProposalType | null): number {
  return PROPOSAL_APPROVAL_THRESHOLDS[type ?? ProposalType.Standard] ?? 0.5;
}

export function encodeMetadata(
  description: string,
  metadata: ProposalMetadataConfig
): string {
  const parts: string[] = [];

  // Determine threshold to store based on type
  if (
    metadata.proposalType &&
    metadata.proposalType !== ProposalType.Standard
  ) {
    const threshold = PROPOSAL_APPROVAL_THRESHOLDS[metadata.proposalType];
    if (threshold) {
      // Store as basis points (e.g. 0.5 -> 5000, 2/3 -> 6667)
      const encodedValue = Math.round(threshold * THRESHOLD_PRECISION);
      parts.push(`approval_threshold=${encodedValue}`);
    }
  }

  const suffix = parts.length > 0 ? `|${parts.join(",")}` : "";

  return `${METADATA_PREFIX}${METADATA_VERSION}${description}${suffix}`;
}

export function decodeMetadata(fullDescription: string): {
  metadata: ProposalMetadataConfig | null;
  description: string;
} {
  if (!fullDescription.startsWith(METADATA_PREFIX)) {
    return { metadata: null, description: fullDescription };
  }

  const version = fullDescription.slice(4, 6);
  if (version !== METADATA_VERSION) {
    return { metadata: null, description: fullDescription };
  }

  const remaining = fullDescription.slice(6);
  const lastPipeIndex = remaining.lastIndexOf("|");

  if (lastPipeIndex === -1) {
    return { metadata: null, description: remaining };
  }

  const cleanDescription = remaining.substring(0, lastPipeIndex);
  const metadataString = remaining.substring(lastPipeIndex + 1);

  const metadata: ProposalMetadataConfig = {};
  const pairs = metadataString.split(",");

  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (!key || !value) continue;

    if (key === "approval_threshold") {
      const rawValue = parseInt(value, 10);
      const threshold = rawValue / THRESHOLD_PRECISION;
      metadata.approvalThreshold = threshold;

      // Infer ProposalType from threshold
      // 6667 / 10000 = 0.6667
      // 2/3 = 0.66666...
      // Check > 0.6
      if (threshold > 0.6) {
        metadata.proposalType = ProposalType.SuperMajority;
      } else if (threshold > 0.4) {
        metadata.proposalType = ProposalType.SimpleMajority;
      } else {
        metadata.proposalType = ProposalType.Standard;
      }
    } else if (key === "proposal_type") {
      // Legacy support for explicit type labels
      if (value === "SimpleMajority")
        metadata.proposalType = ProposalType.SimpleMajority;
      else if (value === "SuperMajority")
        metadata.proposalType = ProposalType.SuperMajority;
      else if (value === "Standard")
        metadata.proposalType = ProposalType.Standard;
    }
  }

  return { metadata, description: cleanDescription };
}
