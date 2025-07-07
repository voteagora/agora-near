import { useNear } from "@/contexts/NearContext";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { MerkleProof } from "@/lib/contracts/types/common";
import { VAccount } from "@/lib/contracts/types/venear";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchProof } from "../useFetchProof";

// Mock the useNear hook
vi.mock("@/contexts/NearContext", () => ({
  useNear: vi.fn(),
}));

const mockUseNear = vi.mocked(useNear);

describe("useFetchProof", () => {
  let mockViewMethod: ReturnType<typeof vi.fn>;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;

  const mockAccountId = "test-account.testnet";
  const mockBlockHeight = 12345;
  const mockMerkleProof: MerkleProof = {
    index: 0,
    path: ["hash1", "hash2"],
  };
  const mockVAccount: VAccount = {
    V0: {
      account_id: mockAccountId,
      balance: {
        extra_venear_balance: "500000000000000000000000",
        near_balance: "500000000000000000000000",
      },
      delegated_balance: {
        extra_venear_balance: "250000000000000000000000",
        near_balance: "250000000000000000000000",
      },
      delegation: null,
      update_timestamp: "1234567890",
    },
  };
  const mockProofResult: [MerkleProof, VAccount] = [
    mockMerkleProof,
    mockVAccount,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    wrapper = ({ children }) => <>{children}</>;

    mockViewMethod = vi.fn();

    // Setup default mocks
    mockUseNear.mockReturnValue({
      viewMethod: mockViewMethod,
      signedAccountId: mockAccountId,
      wallet: {} as any,
      connectionStore: {} as any,
      connection: {} as any,
      keyStore: {} as any,
      config: {} as any,
      isSignedIn: true,
      callMethod: vi.fn(),
      getBalance: vi.fn(),
      signAndSendTransaction: vi.fn(),
      signAndSendTransactionWithAccount: vi.fn(),
      requestSignIn: vi.fn(),
      signOut: vi.fn(),
      isConnected: true,
      connectWallet: vi.fn(),
      disconnectWallet: vi.fn(),
      switchAccount: vi.fn(),
      switchWallet: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Hook Initialization", () => {
    it("should initialize and return fetchProof function", () => {
      const { result } = renderHook(() => useFetchProof(), { wrapper });

      expect(result.current).toBeInstanceOf(Function);
      expect(mockUseNear).toHaveBeenCalledTimes(1);
    });

    it("should call useNear to get viewMethod", () => {
      renderHook(() => useFetchProof(), { wrapper });

      expect(mockUseNear).toHaveBeenCalledWith();
    });
  });

  describe("fetchProof", () => {
    it("should call viewMethod with correct parameters", async () => {
      mockViewMethod.mockResolvedValue(mockProofResult);

      const { result } = renderHook(() => useFetchProof(), { wrapper });

      await act(async () => {
        await result.current(mockAccountId, mockBlockHeight);
      });

      expect(mockViewMethod).toHaveBeenCalledWith({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        method: "get_proof",
        args: { account_id: mockAccountId },
        blockId: mockBlockHeight,
        useArchivalNode: true,
      });
    });

    it("should return proof data when successful", async () => {
      mockViewMethod.mockResolvedValue(mockProofResult);

      const { result } = renderHook(() => useFetchProof(), { wrapper });

      let proofData: [MerkleProof, VAccount] | null = null;

      await act(async () => {
        proofData = await result.current(mockAccountId, mockBlockHeight);
      });

      expect(proofData).toEqual(mockProofResult);
      expect(proofData).not.toBeNull();
      expect(proofData![0]).toEqual(mockMerkleProof);
      expect(proofData![1]).toEqual(mockVAccount);
    });

    it("should return null when no proof is found", async () => {
      mockViewMethod.mockResolvedValue(null);

      const { result } = renderHook(() => useFetchProof(), { wrapper });

      let proofData: [MerkleProof, VAccount] | null = null;

      await act(async () => {
        proofData = await result.current(mockAccountId, mockBlockHeight);
      });

      expect(proofData).toBeNull();
    });

    it("should handle errors from viewMethod", async () => {
      const mockError = new Error("Contract call failed");
      mockViewMethod.mockRejectedValue(mockError);

      const { result } = renderHook(() => useFetchProof(), { wrapper });

      await expect(
        act(async () => {
          await result.current(mockAccountId, mockBlockHeight);
        })
      ).rejects.toThrow("Contract call failed");

      expect(mockViewMethod).toHaveBeenCalledWith({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        method: "get_proof",
        args: { account_id: mockAccountId },
        blockId: mockBlockHeight,
        useArchivalNode: true,
      });
    });
  });
});
