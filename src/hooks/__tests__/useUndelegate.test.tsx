import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUndelegate } from "../useUndelegate";

// Mock the hooks
vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

vi.mock("@/lib/contractConstants", () => ({
  TESTNET_CONTRACTS: {
    VENEAR_CONTRACT_ID: "venear.testnet",
  },
}));

vi.mock("@/hooks/useReadHOSContract", () => ({
  READ_NEAR_CONTRACT_QK: "READ_NEAR_CONTRACT_QK",
}));

const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);

describe("useUndelegate", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockMutate: ReturnType<typeof vi.fn>;
  let mockMutateAsync: ReturnType<typeof vi.fn>;
  let mockOnSuccess: ReturnType<typeof vi.fn>;
  let mockInvalidateQueries: ReturnType<typeof vi.fn>;

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

    // Mock invalidateQueries
    queryClient.invalidateQueries = mockInvalidateQueries;

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
      const { result } = renderHook(() => useUndelegate({}), { wrapper });

      expect(result.current.error).toBeNull();
      expect(result.current.isUndelegating).toBe(false);
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(() => useUndelegate({}), { wrapper });

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "VENEAR",
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

      const { result } = renderHook(() => useUndelegate({}), { wrapper });

      expect(result.current.error).toBe(mockError);
    });

    it("should handle loading state", () => {
      mockUseWriteHOSContract.mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
        isPending: true,
        error: null,
        data: undefined,
      } as any);

      const { result } = renderHook(() => useUndelegate({}), { wrapper });

      expect(result.current.isUndelegating).toBe(true);
    });
  });

  describe("undelegate", () => {
    it("should call mutate with correct parameters", () => {
      const { result } = renderHook(() => useUndelegate({}), { wrapper });

      act(() => {
        result.current.undelegate();
      });

      expect(mockMutate).toHaveBeenCalledWith({
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "undelegate",
          },
        ],
      });
    });

    it("should return the result of mutate call", () => {
      const mockResult = { success: true };
      mockMutate.mockReturnValue(mockResult);

      const { result } = renderHook(() => useUndelegate({}), { wrapper });

      const undelegateResult = result.current.undelegate();

      expect(undelegateResult).toBe(mockResult);
    });
  });

  describe("Success Callback", () => {
    it("should invalidate queries on success", () => {
      renderHook(() => useUndelegate({}), { wrapper });

      // Get the onSuccess callback that was passed to useWriteHOSContract
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: [READ_NEAR_CONTRACT_QK, TESTNET_CONTRACTS.VENEAR_CONTRACT_ID],
      });
    });

    it("should call onSuccess callback when provided", () => {
      renderHook(() => useUndelegate({ onSuccess: mockOnSuccess }), {
        wrapper,
      });

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
