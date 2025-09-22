export interface ClaimProof {
  projectId: string;
  address: string;
  amount: string;
  treeIndex: number;
  claimed: boolean;
  claimedAt: string | null;
  claimedTxHash: string | null;
  createdAt: string;
  project: {
    id: string;
    name: string;
    [key: string]: any;
  };
  proofData: {
    proof: string[];
  } | null;
}

export interface ClaimProofsResponse {
  address: string;
  totalProofs: number;
  proofs: ClaimProof[];
}
