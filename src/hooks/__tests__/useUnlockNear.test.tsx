import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUnlockNear } from "../useUnlockNear";

// Mock the hooks
vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);

describe("useUnlockNear", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockMutateAsync: ReturnType<typeof vi.fn>;
  let mockOnSuccess: ReturnType<typeof vi.fn>;

  const mockLockupAccountId = "test-lockup.testnet";

  beforeEach(() => {
    vi.clearAllMocks();

    mockOnSuccess = vi.fn();

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
        () => useUnlockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.unlockingNearError).toBeNull();
      expect(result.current.isUnlockingNear).toBe(false);
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(
        () => useUnlockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "LOCKUP",
        onSuccess: undefined,
      });
    });

    it("should call useWriteHOSContract with onSuccess callback when provided", () => {
      renderHook(
        () =>
          useUnlockNear({
            lockupAccountId: mockLockupAccountId,
            onSuccess: mockOnSuccess,
          }),
        { wrapper }
      );

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "LOCKUP",
        onSuccess: mockOnSuccess,
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
        () => useUnlockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.unlockingNearError).toBe(mockError);
    });

    it("should handle pending state from contract call", () => {
      mockUseWriteHOSContract.mockReturnValue({
        mutate: vi.fn(),
        mutateAsync: mockMutateAsync,
        isPending: true,
        error: null,
        data: undefined,
      } as any);

      const { result } = renderHook(
        () => useUnlockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.isUnlockingNear).toBe(true);
    });
  });

  describe("beginUnlockNear", () => {
    it("should call mutateAsync with correct parameters when amount is provided", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useUnlockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000";

      await act(async () => {
        await result.current.beginUnlockNear({ amount });
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "begin_unlock_near",
            args: { amount },
          },
        ],
      });
    });

    it("should call mutateAsync with correct parameters when amount is not provided", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useUnlockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.beginUnlockNear({});
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "begin_unlock_near",
            args: { amount: undefined },
          },
        ],
      });
    });

    it("should handle async errors", async () => {
      const mockError = new Error("Async error");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useUnlockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await expect(
        act(async () => {
          await result.current.beginUnlockNear({
            amount: "1000000000000000000000000",
          });
        })
      ).rejects.toThrow("Async error");

      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  describe("Success Callback", () => {
    it("should call onSuccess callback when mutation succeeds", () => {
      renderHook(
        () =>
          useUnlockNear({
            lockupAccountId: mockLockupAccountId,
            onSuccess: mockOnSuccess,
          }),
        { wrapper }
      );

      // Get the onSuccess callback that was passed to useWriteHOSContract
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
