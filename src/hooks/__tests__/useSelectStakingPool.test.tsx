import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSelectStakingPool } from "../useSelectStakingPool";

// Mock the hooks
vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);

describe("useSelectStakingPool", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockMutateAsync: ReturnType<typeof vi.fn>;
  let mockInvalidateQueries: ReturnType<typeof vi.fn>;

  const mockLockupAccountId = "test-lockup.testnet";

  beforeEach(() => {
    vi.clearAllMocks();

    mockInvalidateQueries = vi.fn();

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

    // Mock the invalidateQueries method
    vi.spyOn(queryClient, "invalidateQueries").mockImplementation(
      mockInvalidateQueries
    );

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
        () => useSelectStakingPool({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.error).toBeNull();
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(
        () => useSelectStakingPool({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "LOCKUP",
        onSuccess: expect.any(Function),
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
        () => useSelectStakingPool({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.error).toBe(mockError);
    });
  });

  describe("selectStakingPoolAsync", () => {
    it("should call mutateAsync with correct parameters", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useSelectStakingPool({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const stakingPoolId = "test-pool.testnet";

      await act(async () => {
        await result.current.selectStakingPoolAsync({ stakingPoolId });
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "select_staking_pool",
            args: {
              staking_pool_account_id: stakingPoolId,
            },
          },
        ],
      });
    });

    it("should handle async errors", async () => {
      const mockError = new Error("Async error");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useSelectStakingPool({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await expect(
        act(async () => {
          await result.current.selectStakingPoolAsync({
            stakingPoolId: "test-pool.testnet",
          });
        })
      ).rejects.toThrow("Async error");

      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  describe("Success Callback", () => {
    it("should invalidate queries when mutation succeeds", () => {
      renderHook(
        () => useSelectStakingPool({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      // Get the onSuccess callback that was passed to useWriteHOSContract
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: [
          READ_NEAR_CONTRACT_QK,
          mockLockupAccountId,
          "get_staking_pool_account_id",
        ],
      });
    });
  });
});
