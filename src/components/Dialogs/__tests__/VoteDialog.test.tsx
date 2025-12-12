
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NearVoteDialog } from "../VoteDialog";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mocks
const mockCastVote = vi.fn();
const mockFetchProof = vi.fn();
const mockCloseDialog = vi.fn();

vi.mock("@/hooks/useCastVote", () => ({
  useCastVote: () => ({
    castVote: mockCastVote,
    isVoting: false,
  }),
}));

vi.mock("@/contexts/NearContext", () => ({
  useNear: () => ({
    signedAccountId: "test.near",
  }),
}));

vi.mock("@/hooks/useFetchProof", () => ({
  useFetchProof: () => mockFetchProof,
}));

vi.mock("@/components/Button", () => ({
  UpdatedButton: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe("NearVoteDialog", () => {
  const mockProposal: any = {
    id: 1,
    voting_options: ["Yes", "No"],
    snapshot_and_state: {
      snapshot: {
        block_height: 12345,
      },
    },
  };

  const mockConfig: any = {
    vote_storage_fee: "100",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches proof on mount and shows confirmation", async () => {
    mockFetchProof.mockResolvedValue(["mockProof", "mockVAccount"]);
    
    render(
      <NearVoteDialog
        proposal={mockProposal}
        config={mockConfig}
        closeDialog={mockCloseDialog}
        preSelectedVote={0}
      />
    );

    // Should show loading state initially
    expect(screen.getByText("Preparing vote transaction...")).toBeInTheDocument();

    // specific wait for the text to disappear or new text to appear
    await waitFor(() => {
        expect(screen.getByText("Confirm Vote")).toBeInTheDocument();
    });

    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("handles proof fetch failure", async () => {
    mockFetchProof.mockResolvedValue(null);

    render(
        <NearVoteDialog
          proposal={mockProposal}
          config={mockConfig}
          closeDialog={mockCloseDialog}
          preSelectedVote={0}
        />
      );

    await waitFor(() => {
        expect(screen.getByText("Error: Failed to fetch merkle proof")).toBeInTheDocument();
    });
  });

  it("calls castVote when confirmed", async () => {
    const mockProof = ["mockProof", "mockVAccount"];
    mockFetchProof.mockResolvedValue(mockProof);

    render(
        <NearVoteDialog
          proposal={mockProposal}
          config={mockConfig}
          closeDialog={mockCloseDialog}
          preSelectedVote={0}
        />
      );

    await waitFor(() => {
        expect(screen.getByText("Confirm Vote")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Sign & Vote"));

    await waitFor(() => {
      expect(mockCastVote).toHaveBeenCalledWith({
        proposalId: 1,
        voteIndex: 0,
        blockId: 12345,
        voteStorageFee: "100",
        proof: mockProof,
      });
    });

    await waitFor(() => {
      expect(mockCloseDialog).toHaveBeenCalled();
    });
  });
});
