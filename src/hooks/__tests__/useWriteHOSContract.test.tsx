import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { useNear } from "@/contexts/NearContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the contexts and external dependencies
vi.mock("@/contexts/NearContext", () => ({
  useNear: vi.fn(),
}));

// Mock the method configs
vi.mock("@/lib/contracts/config/methods/lockup", () => ({
  lockupMethodConfig: {
    lock_near: {
      deposit: "1",
    },
    begin_unlock_near: {
      deposit: "1",
    },
  },
}));

vi.mock("@/lib/contracts/config/methods/venear", () => ({
  venearMethodConfig: {
    delegate_all: {
      deposit: "1",
    },
    deploy_lockup: {
      deposit: undefined,
      gas: "100 Tgas",
    },
  },
}));

vi.mock("@/lib/contracts/config/methods/voting", () => ({
  votingMethodConfig: {
    vote: {
      gas: "100 Tgas",
    },
    create_proposal: {
      gas: "100 Tgas",
      deposit: "0.2",
    },
  },
}));

const mockUseNear = vi.mocked(useNear);

describe("useWriteHOSContract", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockCallContracts: ReturnType<typeof vi.fn>;
  let mockOnSuccess: ReturnType<typeof vi.fn>;

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

    mockCallContracts = vi.fn();
    mockOnSuccess = vi.fn();

    // Setup default mocks
    mockUseNear.mockReturnValue({
      callContracts: mockCallContracts,
    } as any);
  });

  afterEach(async () => {
    queryClient.clear();
  });

  describe("Hook Initialization", () => {
    it("should initialize with correct default values for LOCKUP contract", () => {
      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "LOCKUP" }),
        { wrapper }
      );

      expect(result.current.error).toBeNull();
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it("should call useNear hook", () => {
      renderHook(() => useWriteHOSContract({ contractType: "LOCKUP" }), {
        wrapper,
      });

      expect(mockUseNear).toHaveBeenCalledTimes(1);
    });
  });

  describe("LOCKUP Contract", () => {
    it("should call mutate with correct parameters and apply default gas/deposit", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "LOCKUP" }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
          args: { amount: "1000000000000000000000000" },
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockCallContracts).toHaveBeenCalledWith({
        contractCalls: {
          [contractId]: [
            {
              methodName: "lock_near",
              args: { amount: "1000000000000000000000000" },
              deposit: "1",
            },
          ],
        },
      });
    });

    it("should override default gas/deposit when provided", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "LOCKUP" }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
          args: { amount: "1000000000000000000000000" },
          gas: "200 Tgas",
          deposit: "5",
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockCallContracts).toHaveBeenCalledWith({
        contractCalls: {
          [contractId]: [
            {
              methodName: "lock_near",
              args: { amount: "1000000000000000000000000" },
              gas: "200 Tgas",
              deposit: "5",
            },
          ],
        },
      });
    });

    it("should handle multiple method calls", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "LOCKUP" }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
          args: { amount: "1000000000000000000000000" },
        },
        {
          methodName: "begin_unlock_near" as const,
          args: { amount: "500000000000000000000000" },
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockCallContracts).toHaveBeenCalledWith({
        contractCalls: {
          [contractId]: [
            {
              methodName: "lock_near",
              args: { amount: "1000000000000000000000000" },
              deposit: "1",
            },
            {
              methodName: "begin_unlock_near",
              args: { amount: "500000000000000000000000" },
              deposit: "1",
            },
          ],
        },
      });
    });
  });

  describe("VENEAR Contract", () => {
    it("should call mutate with correct parameters for VENEAR contract", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "VENEAR" }),
        { wrapper }
      );

      const contractId = "test-venear.testnet";
      const methodCalls = [
        {
          methodName: "delegate_all" as const,
          args: { receiver_id: "test.testnet" },
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockCallContracts).toHaveBeenCalledWith({
        contractCalls: {
          [contractId]: [
            {
              methodName: "delegate_all",
              args: { receiver_id: "test.testnet" },
              deposit: "1",
            },
          ],
        },
      });
    });
  });

  describe("VOTING Contract", () => {
    it("should call mutate with correct parameters for VOTING contract", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "VOTING" }),
        { wrapper }
      );

      const contractId = "test-voting.testnet";
      const methodCalls = [
        {
          methodName: "vote" as const,
          args: { proposal_id: 1, vote: 1 },
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockCallContracts).toHaveBeenCalledWith({
        contractCalls: {
          [contractId]: [
            {
              methodName: "vote",
              args: { proposal_id: 1, vote: 1 },
              gas: "100 Tgas",
            },
          ],
        },
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle errors from contract calls", async () => {
      const mockError = new Error("Contract call failed");
      mockCallContracts.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "LOCKUP" }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
          args: { amount: "1000000000000000000000000" },
        },
      ];

      await expect(
        result.current.mutateAsync({
          contractId,
          methodCalls,
        })
      ).rejects.toThrow("Contract call failed");

      expect(mockCallContracts).toHaveBeenCalled();
    });

    it("should handle useNear throwing error", () => {
      mockUseNear.mockImplementation(() => {
        throw new Error("useNear error");
      });

      expect(() => {
        renderHook(() => useWriteHOSContract({ contractType: "LOCKUP" }), {
          wrapper,
        });
      }).toThrow("useNear error");
    });
  });

  describe("Success Callback", () => {
    it("should call onSuccess callback when mutation succeeds", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () =>
          useWriteHOSContract({
            contractType: "LOCKUP",
            onSuccess: mockOnSuccess,
          }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
          args: { amount: "1000000000000000000000000" },
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it("should not call onSuccess callback when mutation fails", async () => {
      const mockError = new Error("Contract call failed");
      mockCallContracts.mockRejectedValue(mockError);

      const { result } = renderHook(
        () =>
          useWriteHOSContract({
            contractType: "LOCKUP",
            onSuccess: mockOnSuccess,
          }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
          args: { amount: "1000000000000000000000000" },
        },
      ];

      await expect(
        act(async () => {
          await result.current.mutateAsync({
            contractId,
            methodCalls,
          });
        })
      ).rejects.toThrow("Contract call failed");

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe("Method Arguments", () => {
    it("should handle method calls with no arguments", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "LOCKUP" }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockCallContracts).toHaveBeenCalledWith({
        contractCalls: {
          [contractId]: [
            {
              methodName: "lock_near",
              deposit: "1",
            },
          ],
        },
      });
    });

    it("should handle method calls with empty arguments", async () => {
      mockCallContracts.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useWriteHOSContract({ contractType: "LOCKUP" }),
        { wrapper }
      );

      const contractId = "test-lockup.testnet";
      const methodCalls = [
        {
          methodName: "lock_near" as const,
          args: {},
        },
      ];

      await act(async () => {
        await result.current.mutateAsync({
          contractId,
          methodCalls,
        });
      });

      expect(mockCallContracts).toHaveBeenCalledWith({
        contractCalls: {
          [contractId]: [
            {
              methodName: "lock_near",
              args: {},
              deposit: "1",
            },
          ],
        },
      });
    });
  });
});
