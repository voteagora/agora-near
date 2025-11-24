export interface ClaimProof {
  projectId: string;
  address: string;
  lockup: string;
  amount: string;
  treeIndex: number;
  claimed: boolean;
  claimedAt: string | null;
  claimedTxHash: string | null;
  createdAt: string;
  campaignId: number;
  project: {
    id: string;
    name: string;
    campaignId?: number;
    [key: string]: any;
  };
  proofData: {
    proof: string[];
    campaignId: number;
    lockup: string;
    amount: string;
  } | null;
}

export interface ClaimProofsResponse {
  address: string;
  totalProofs: number;
  proofs: ClaimProof[];
}
