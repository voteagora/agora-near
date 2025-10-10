import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { CONTRACTS } from "@/lib/contractConstants";
import { READ_NEAR_CONTRACT_QK } from "@/hooks/useReadHOSContract";
import { DELEGATES_QK } from "@/hooks/useDelegates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDelegateAll } from "../useDelegateAll";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import Big from "big.js";

// Mock the hooks
vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

vi.mock("@/lib/contractConstants", () => ({
  CONTRACTS: {
    VENEAR_CONTRACT_ID: "venear.testnet",
  },
}));

vi.mock("@/hooks/useReadHOSContract", () => ({
  READ_NEAR_CONTRACT_QK: "READ_NEAR_CONTRACT_QK",
}));

const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);

describe("useDelegateAll", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;
  let mockMutate: ReturnType<typeof vi.fn>;
  let mockMutateAsync: ReturnType<typeof vi.fn>;
  let mockOnSuccess: ReturnType<typeof vi.fn>;
  let mockInvalidateQueries: ReturnType<typeof vi.fn>;
  let mockSetQueryData: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockInvalidateQueries = vi.fn();
    mockSetQueryData = vi.fn();
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

    // Mock invalidateQueries and setQueryData
    queryClient.invalidateQueries = mockInvalidateQueries;
    queryClient.setQueryData = mockSetQueryData;

    const TestingAdapter = withNuqsTestingAdapter({
      searchParams: {},
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <TestingAdapter>{children}</TestingAdapter>
      </QueryClientProvider>
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
        () => useDelegateAll({ delegateVotingPower: new Big("100") }),
        { wrapper }
      );

      expect(result.current.error).toBeNull();
      expect(result.current.isDelegating).toBe(false);
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(
        () => useDelegateAll({ delegateVotingPower: new Big("100") }),
        { wrapper }
      );

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

      const { result } = renderHook(
        () => useDelegateAll({ delegateVotingPower: new Big("100") }),
        { wrapper }
      );

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

      const { result } = renderHook(
        () => useDelegateAll({ delegateVotingPower: new Big("100") }),
        { wrapper }
      );

      expect(result.current.isDelegating).toBe(true);
    });
  });

  describe("delegateAll", () => {
    it("should call mutate with correct parameters", () => {
      const { result } = renderHook(
        () => useDelegateAll({ delegateVotingPower: new Big("100") }),
        { wrapper }
      );

      const receiverId = "delegate.testnet";

      act(() => {
        result.current.delegateAll(receiverId);
      });

      expect(mockMutate).toHaveBeenCalledWith({
        contractId: CONTRACTS.VENEAR_CONTRACT_ID,
        methodCalls: [
          {
            methodName: "delegate_all",
            args: {
              receiver_id: receiverId,
            },
          },
        ],
      });
    });

    it("should return the result of mutate call", () => {
      const mockResult = { success: true };
      mockMutate.mockReturnValue(mockResult);

      const { result } = renderHook(
        () => useDelegateAll({ delegateVotingPower: new Big("100") }),
        { wrapper }
      );

      const receiverId = "delegate.testnet";
      const delegateResult = result.current.delegateAll(receiverId);

      expect(delegateResult).toBe(mockResult);
    });
  });

  describe("Success Callback", () => {
    it("should invalidate queries on success", () => {
      renderHook(
        () => useDelegateAll({ delegateVotingPower: new Big("100") }),
        { wrapper }
      );

      // Get the onSuccess callback that was passed to useWriteHOSContract
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: [READ_NEAR_CONTRACT_QK, CONTRACTS.VENEAR_CONTRACT_ID],
      });
    });

    it("should call onSuccess callback when provided", () => {
      renderHook(
        () =>
          useDelegateAll({
            onSuccess: mockOnSuccess,
            delegateVotingPower: new Big("100"),
          }),
        {
          wrapper,
        }
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

  describe("Query Data Updates", () => {
    const mockDelegatesData = {
      pages: [
        {
          delegates: [
            {
              address: "delegate1.testnet",
              votingPower: "1000",
              name: "Delegate 1",
            },
            {
              address: "delegate2.testnet",
              votingPower: "2000",
              name: "Delegate 2",
            },
            {
              address: "current-delegate.testnet",
              votingPower: "500",
              name: "Current Delegate",
            },
          ],
        },
      ],
      pageParams: [undefined],
    };

    beforeEach(() => {
      // Mock the setQueryData to return the mock data when called with a function
      mockSetQueryData.mockImplementation((queryKey, updaterFn) => {
        if (typeof updaterFn === "function") {
          return updaterFn(mockDelegatesData);
        }
        return mockDelegatesData;
      });
    });

    it("should call setQueryData with correct query key", () => {
      const TestingAdapter = withNuqsTestingAdapter({
        searchParams: {
          order_by: "voting_power",
          filter: "active",
          issues: "governance",
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <TestingAdapter>{children}</TestingAdapter>
        </QueryClientProvider>
      );

      renderHook(
        () =>
          useDelegateAll({
            delegateVotingPower: new Big("100"),
            currentDelegateeAddress: "current-delegate.testnet",
          }),
        { wrapper }
      );

      // Get the onSuccess callback and trigger it
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      expect(mockSetQueryData).toHaveBeenCalledWith(
        [DELEGATES_QK, "voting_power", "active", "governance"],
        expect.any(Function)
      );
    });

    it("should update voting power for target delegate (adding voting power)", () => {
      // Use a single hook instance
      const { result } = renderHook(
        () =>
          useDelegateAll({
            delegateVotingPower: new Big("100"),
            currentDelegateeAddress: "current-delegate.testnet",
          }),
        { wrapper }
      );

      // Call delegateAll to set the target delegate
      act(() => {
        result.current.delegateAll("delegate1.testnet");
      });

      // Get the onSuccess callback and trigger it
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      // Verify setQueryData was called
      expect(mockSetQueryData).toHaveBeenCalled();

      // Get the updater function that was passed to setQueryData
      const updaterFunction = mockSetQueryData.mock.calls[0][1];
      const updatedData = updaterFunction(mockDelegatesData);

      // Check that the target delegate's voting power was increased
      const targetDelegate = updatedData.pages[0].delegates.find(
        (d: any) => d.address === "delegate1.testnet"
      );
      expect(targetDelegate.votingPower).toBe("1100"); // 1000 + 100
    });

    it("should update voting power for current delegatee (subtracting voting power)", () => {
      // Use a single hook instance
      const { result } = renderHook(
        () =>
          useDelegateAll({
            delegateVotingPower: new Big("100"),
            currentDelegateeAddress: "current-delegate.testnet",
          }),
        { wrapper }
      );

      // Call delegateAll to set the target delegate
      act(() => {
        result.current.delegateAll("delegate1.testnet");
      });

      // Get the onSuccess callback and trigger it
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      // Get the updater function that was passed to setQueryData
      const updaterFunction = mockSetQueryData.mock.calls[0][1];
      const updatedData = updaterFunction(mockDelegatesData);

      // Check that the current delegate's voting power was decreased
      const currentDelegate = updatedData.pages[0].delegates.find(
        (d: any) => d.address === "current-delegate.testnet"
      );
      expect(currentDelegate.votingPower).toBe("400"); // 500 - 100
    });

    it("should handle delegates with null voting power", () => {
      const mockDataWithNullPower = {
        pages: [
          {
            delegates: [
              {
                address: "delegate-with-null.testnet",
                votingPower: null,
                name: "Delegate With Null",
              },
            ],
          },
        ],
        pageParams: [undefined],
      };

      mockSetQueryData.mockImplementation((queryKey, updaterFn) => {
        if (typeof updaterFn === "function") {
          return updaterFn(mockDataWithNullPower);
        }
        return mockDataWithNullPower;
      });

      const { result } = renderHook(
        () =>
          useDelegateAll({
            delegateVotingPower: new Big("100"),
          }),
        { wrapper }
      );

      act(() => {
        result.current.delegateAll("delegate-with-null.testnet");
      });

      // Get the onSuccess callback and trigger it
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      // Get the updater function that was passed to setQueryData
      const updaterFunction = mockSetQueryData.mock.calls[0][1];
      const updatedData = updaterFunction(mockDataWithNullPower);

      // Check that null voting power is treated as "0" and updated correctly
      const targetDelegate = updatedData.pages[0].delegates.find(
        (d: any) => d.address === "delegate-with-null.testnet"
      );
      expect(targetDelegate.votingPower).toBe("100"); // 0 + 100
    });

    it("should handle current delegatee with null voting power (clamped to 0)", () => {
      const mockDataWithNullCurrentDelegatee = {
        pages: [
          {
            delegates: [
              {
                address: "target-delegate.testnet",
                votingPower: "1000",
                name: "Target Delegate",
              },
              {
                address: "current-delegate.testnet",
                votingPower: null, // Null voting power
                name: "Current Delegate With Null Power",
              },
            ],
          },
        ],
        pageParams: [undefined],
      };

      mockSetQueryData.mockImplementation((queryKey, updaterFn) => {
        if (typeof updaterFn === "function") {
          return updaterFn(mockDataWithNullCurrentDelegatee);
        }
        return mockDataWithNullCurrentDelegatee;
      });

      const { result } = renderHook(
        () =>
          useDelegateAll({
            delegateVotingPower: new Big("100"),
            currentDelegateeAddress: "current-delegate.testnet",
          }),
        { wrapper }
      );

      act(() => {
        result.current.delegateAll("target-delegate.testnet");
      });

      // Get the onSuccess callback and trigger it
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      // Get the updater function that was passed to setQueryData
      const updaterFunction = mockSetQueryData.mock.calls[0][1];
      const updatedData = updaterFunction(mockDataWithNullCurrentDelegatee);

      // Check that the target delegate's voting power was increased
      const targetDelegate = updatedData.pages[0].delegates.find(
        (d: any) => d.address === "target-delegate.testnet"
      );
      expect(targetDelegate.votingPower).toBe("1100"); // 1000 + 100

      // Check that current delegatee's null voting power is treated as 0 and clamped to 0
      const currentDelegate = updatedData.pages[0].delegates.find(
        (d: any) => d.address === "current-delegate.testnet"
      );
      expect(currentDelegate.votingPower).toBe("0"); // 0 - 100 = 0 (clamped to minimum of 0)
    });

    it("should not modify delegates that are not target or current delegatee", () => {
      const { result } = renderHook(
        () =>
          useDelegateAll({
            delegateVotingPower: new Big("100"),
            currentDelegateeAddress: "current-delegate.testnet",
          }),
        { wrapper }
      );

      act(() => {
        result.current.delegateAll("delegate1.testnet");
      });

      // Get the onSuccess callback and trigger it
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      // Get the updater function that was passed to setQueryData
      const updaterFunction = mockSetQueryData.mock.calls[0][1];
      const updatedData = updaterFunction(mockDelegatesData);

      // Check that delegate2 (not involved in delegation) remains unchanged
      const unchangedDelegate = updatedData.pages[0].delegates.find(
        (d: any) => d.address === "delegate2.testnet"
      );
      expect(unchangedDelegate.votingPower).toBe("2000"); // Unchanged
    });

    it("should call invalidateQueries for delegates after setQueryData", () => {
      const TestingAdapter = withNuqsTestingAdapter({
        searchParams: {
          order_by: "voting_power",
          filter: "active",
          issues: "governance",
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <TestingAdapter>{children}</TestingAdapter>
        </QueryClientProvider>
      );

      renderHook(
        () =>
          useDelegateAll({
            delegateVotingPower: new Big("100"),
          }),
        { wrapper }
      );

      // Get the onSuccess callback and trigger it
      const onSuccessCallback =
        mockUseWriteHOSContract.mock.calls[0]?.[0]?.onSuccess;

      act(() => {
        onSuccessCallback?.();
      });

      // Verify that both setQueryData and invalidateQueries were called for delegates
      expect(mockSetQueryData).toHaveBeenCalledWith(
        [DELEGATES_QK, "voting_power", "active", "governance"],
        expect.any(Function)
      );

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: [DELEGATES_QK, "voting_power", "active", "governance"],
        refetchType: "none",
      });
    });
  });
});
