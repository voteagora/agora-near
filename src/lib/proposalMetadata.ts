/**
 * Supported proposal types.
 * 'Standard' uses the contract default.
 * 'Tactical' allows overriding quorum/thresholds via metadata.
 */
export enum ProposalType {
  Standard = "Standard",
  Tactical = "Tactical",
}

export interface ProposalMetadataConfig {
  proposalType: ProposalType;
  // Optional override for quorum threshold (e.g., number of votes or token amount)
  quorumThreshold?: number;
}

const METADATA_START_TAG = "```json:metadata";
const METADATA_END_TAG = "```";
const METADATA_REGEX = /```json:metadata\n([\s\S]*?)\n```/;

/**
 * Encodes metadata into the proposal description using a JSON markdown block.
 * If the description already has a metadata block, it is replaced.
 */
export const encodeMetadata = (
  description: string,
  metadata: ProposalMetadataConfig
): string => {
  const jsonBlock = JSON.stringify(metadata, null, 2);
  const metadataBlock = `${METADATA_START_TAG}\n${jsonBlock}\n${METADATA_END_TAG}`;

  // Remove existing metadata block if present to avoid duplication
  const cleanDescription = description.replace(METADATA_REGEX, "").trim();

  return `${cleanDescription}\n\n${metadataBlock}`;
};

/**
 * Decodes metadata from the proposal description.
 * Returns the metadata object and the clean description.
 */
export const decodeMetadata = (
  fullDescription: string
): { metadata: ProposalMetadataConfig | null; description: string } => {
  const match = fullDescription.match(METADATA_REGEX);

  if (!match) {
    return { metadata: null, description: fullDescription };
  }

  try {
    const jsonContent = match[1];
    const metadata = JSON.parse(jsonContent) as ProposalMetadataConfig;
    const description = fullDescription.replace(METADATA_REGEX, "").trim();
    return { metadata, description };
  } catch (error) {
    console.warn("Failed to parse proposal metadata:", error);
    return { metadata: null, description: fullDescription };
  }
};
