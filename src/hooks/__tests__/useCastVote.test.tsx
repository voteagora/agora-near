import { useNear } from "@/contexts/NearContext";
import { CONTRACTS } from "@/lib/contractConstants";
import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { useFetchProof } from "@/hooks/useFetchProof";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCastVote } from "../useCastVote";
import { READ_NEAR_CONTRACT_QK } from "../useReadHOSContract";

// Mock the hooks and contexts
vi.mock("@/contexts/NearContext", () => ({
  useNear: vi.fn(),
}));

vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

vi.mock("@/hooks/useFetchProof", () => ({
  useFetchProof: vi.fn(),
}));

const mockUseNear = vi.mocked(useNear);
const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);
const mockUseFetchProof = vi.mocked(useFetchProof);

describe("useCastVote", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockMutateAsync: ReturnType<typeof vi.fn>;
  let mockOnSuccess: ReturnType<typeof vi.fn>;
  let mockFetchProof: ReturnType<typeof vi.fn>;

  const mockSignedAccountId = "test-account.testnet";
  const mockMerkleProof = ["proof1", "proof2"];
  const mockVAccount = {
    account_id: "test-account.testnet",
    voting_power: "1000",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    mockMutateAsync = vi.fn();
    mockOnSuccess = vi.fn();
    mockFetchProof = vi.fn();

    // Setup default mocks
    mockUseNear.mockReturnValue({
      signedAccountId: mockSignedAccountId,
    } as any);

    mockUseWriteHOSContract.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
      data: undefined,
      variables: undefined,
      isError: false,
      isIdle: true,
      isSuccess: false,
      status: "idle",
      reset: vi.fn(),
      failureCount: 0,
      failureReason: null,
      submittedAt: 0,
    } as any);

    mockUseFetchProof.mockReturnValue(mockFetchProof);
    mockFetchProof.mockResolvedValue([mockMerkleProof, mockVAccount]);
  });

  afterEach(async () => {
    queryClient.clear();
  });

  describe("Hook Initialization", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() => useCastVote({}), { wrapper });

      expect(result.current.error).toBeNull();
      expect(result.current.isVoting).toBe(false);
      expect(typeof result.current.castVote).toBe("function");
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(() => useCastVote({}), { wrapper });

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "VOTING",
        onSuccess: expect.any(Function),
      });
    });

    it("should handle error from contract call", () => {
      const mockError = new Error("Test error");
      mockUseWriteHOSContract.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
        error: mockError,
        data: undefined,
      } as any);

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      expect(result.current.error).toBe(mockError);
    });

    it("should handle loading state", () => {
      mockUseWriteHOSContract.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
        error: null,
        data: undefined,
      } as any);

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      expect(result.current.isVoting).toBe(true);
    });
  });

  describe("castVote", () => {
    const mockCastVoteArgs = {
      proposalId: 123,
      voteIndex: 1,
      voteStorageFee: "1000000000000000000000000",
      blockId: 456,
    };

    it("should call mutateAsync with correct parameters", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      await act(async () => {
        await result.current.castVote(mockCastVoteArgs);
      });

      expect(mockFetchProof).toHaveBeenCalledWith(
        mockSignedAccountId,
        mockCastVoteArgs.blockId
      );

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "vote",
            args: {
              proposal_id: mockCastVoteArgs.proposalId,
              vote: mockCastVoteArgs.voteIndex,
              merkle_proof: mockMerkleProof,
              v_account: mockVAccount,
            },
            deposit: mockCastVoteArgs.voteStorageFee,
          },
        ],
      });
    });

    it("should throw error when no account is connected", async () => {
      mockUseNear.mockReturnValue({
        signedAccountId: null,
      } as any);

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      await expect(
        act(async () => {
          await result.current.castVote(mockCastVoteArgs);
        })
      ).rejects.toThrow("No account connected");

      expect(mockFetchProof).not.toHaveBeenCalled();
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("should throw error when proof is not found", async () => {
      mockFetchProof.mockResolvedValue(null);

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      await expect(
        act(async () => {
          await result.current.castVote(mockCastVoteArgs);
        })
      ).rejects.toThrow("Account merkle proof not found");

      expect(mockFetchProof).toHaveBeenCalledWith(
        mockSignedAccountId,
        mockCastVoteArgs.blockId
      );
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("should handle async errors from fetchProof", async () => {
      const mockError = new Error("Proof fetch error");
      mockFetchProof.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      await expect(
        act(async () => {
          await result.current.castVote(mockCastVoteArgs);
        })
      ).rejects.toThrow("Proof fetch error");

      expect(mockFetchProof).toHaveBeenCalled();
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("should handle async errors from mutateAsync", async () => {
      const mockError = new Error("Vote mutation error");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      await expect(
        act(async () => {
          await result.current.castVote(mockCastVoteArgs);
        })
      ).rejects.toThrow("Vote mutation error");

      expect(mockFetchProof).toHaveBeenCalled();
      expect(mockMutateAsync).toHaveBeenCalled();
    });

    it("should handle different vote indices", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useCastVote({}), { wrapper });

      const testArgs = { ...mockCastVoteArgs, voteIndex: 2 };

      await act(async () => {
        await result.current.castVote(testArgs);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: CONTRACTS.VOTING_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "vote",
            args: {
              proposal_id: testArgs.proposalId,
              vote: testArgs.voteIndex,
              merkle_proof: mockMerkleProof,
              v_account: mockVAccount,
            },
            deposit: testArgs.voteStorageFee,
          },
        ],
      });
    });
  });

  describe("Success Callback", () => {
    it("should call onSuccess callback when mutation succeeds", () => {
      renderHook(() => useCastVote({ onSuccess: mockOnSuccess }), { wrapper });

      // Get the onSuccess callback that was passed to useWriteHOSContract
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it("should invalidate queries when mutation succeeds", () => {
      const mockInvalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

      renderHook(() => useCastVote({}), { wrapper });

      // Get the onSuccess callback that was passed to useWriteHOSContract
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VOTING_CONTRACT_ID],
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VENEAR_CONTRACT_ID],
      });
    });
  });
});
