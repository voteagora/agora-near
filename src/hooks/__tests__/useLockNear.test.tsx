import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLockNear } from "../useLockNear";

// Mock the hooks
vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);

describe("useLockNear", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockMutate: ReturnType<typeof vi.fn>;
  let mockMutateAsync: ReturnType<typeof vi.fn>;
  let mockOnSuccess: ReturnType<typeof vi.fn>;

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

    mockMutate = vi.fn();
    mockMutateAsync = vi.fn();
    mockOnSuccess = vi.fn();

    // Setup default mocks
    mockUseWriteHOSContract.mockReturnValue({
      mutate: mockMutate,
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
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.lockingNearError).toBeNull();
      expect(result.current.isLockingNear).toBe(false);
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(() => useLockNear({ lockupAccountId: mockLockupAccountId }), {
        wrapper,
      });

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "LOCKUP",
        onSuccess: expect.any(Function),
      });
    });

    it("should handle error from contract call", () => {
      const mockError = new Error("Test error");
      mockUseWriteHOSContract.mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
        isPending: false,
        error: mockError,
        data: undefined,
      } as any);

      const { result } = renderHook(
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.lockingNearError).toBe(mockError);
    });

    it("should handle loading state", () => {
      mockUseWriteHOSContract.mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
        isPending: true,
        error: null,
        data: undefined,
      } as any);

      const { result } = renderHook(
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.isLockingNear).toBe(true);
    });
  });

  describe("lockNear", () => {
    it("should call mutate with correct parameters", () => {
      const { result } = renderHook(
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000"; // 1 NEAR in yoctoNEAR

      act(() => {
        result.current.lockNear({ amount });
      });

      expect(mockMutate).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "lock_near",
            args: {
              amount,
            },
            gas: "100 Tgas",
          },
        ],
      });
    });

    it("should handle locking with undefined amount", () => {
      const { result } = renderHook(
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      act(() => {
        result.current.lockNear({});
      });

      expect(mockMutate).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "lock_near",
            args: {
              amount: undefined,
            },
            gas: "100 Tgas",
          },
        ],
      });
    });
  });

  describe("lockNearAsync", () => {
    it("should call mutateAsync with correct parameters", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000"; // 1 NEAR in yoctoNEAR

      await act(async () => {
        await result.current.lockNearAsync({ amount });
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "lock_near",
            args: {
              amount,
            },
            gas: "100 Tgas",
          },
        ],
      });
    });

    it("should handle async errors", async () => {
      const mockError = new Error("Async error");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await expect(
        act(async () => {
          await result.current.lockNearAsync({
            amount: "1000000000000000000000000",
          });
        })
      ).rejects.toThrow("Async error");

      expect(mockMutateAsync).toHaveBeenCalled();
    });

    it("should handle locking with undefined amount", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useLockNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.lockNearAsync({});
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "lock_near",
            args: {
              amount: undefined,
            },
            gas: "100 Tgas",
          },
        ],
      });
    });
  });

  describe("Success Callback", () => {
    it("should call onSuccess callback when mutation succeeds", () => {
      renderHook(
        () =>
          useLockNear({
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

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
