import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRefreshStakingPoolBalance } from "../useRefreshStakingPoolBalance";

// Mock the hooks
vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);

describe("useRefreshStakingPoolBalance", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockMutateAsync: ReturnType<typeof vi.fn>;

  const mockLockupAccountId = "test-lockup.testnet";

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

    // Setup default mocks
    mockUseWriteHOSContract.mockReturnValue({
      mutate: vi.fn(),
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
  });

  afterEach(async () => {
    queryClient.clear();
  });

  describe("Hook Initialization", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(
        () =>
          useRefreshStakingPoolBalance({
            lockupAccountId: mockLockupAccountId,
          }),
        { wrapper }
      );

      expect(result.current.error).toBeNull();
      expect(typeof result.current.refreshStakingPoolBalanceAsync).toBe(
        "function"
      );
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(
        () =>
          useRefreshStakingPoolBalance({
            lockupAccountId: mockLockupAccountId,
          }),
        { wrapper }
      );

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "LOCKUP",
      });
    });

    it("should handle error from contract call", () => {
      const mockError = new Error("Test error");
      mockUseWriteHOSContract.mockReturnValue({
        mutate: vi.fn(),
        mutateAsync: mockMutateAsync,
        isPending: false,
        error: mockError,
        data: undefined,
      } as any);

      const { result } = renderHook(
        () =>
          useRefreshStakingPoolBalance({
            lockupAccountId: mockLockupAccountId,
          }),
        { wrapper }
      );

      expect(result.current.error).toBe(mockError);
    });
  });

  describe("refreshStakingPoolBalanceAsync", () => {
    it("should call mutateAsync with correct parameters", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () =>
          useRefreshStakingPoolBalance({
            lockupAccountId: mockLockupAccountId,
          }),
        { wrapper }
      );

      await act(async () => {
        await result.current.refreshStakingPoolBalanceAsync();
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "refresh_staking_pool_balance",
            args: {},
          },
        ],
      });
    });

    it("should handle async errors", async () => {
      const mockError = new Error("Async error");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(
        () =>
          useRefreshStakingPoolBalance({
            lockupAccountId: mockLockupAccountId,
          }),
        { wrapper }
      );

      await expect(
        act(async () => {
          await result.current.refreshStakingPoolBalanceAsync();
        })
      ).rejects.toThrow("Async error");

      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });
});
