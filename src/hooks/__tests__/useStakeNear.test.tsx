import { useWriteHOSContract } from "@/hooks/useWriteHOSContract";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useStakeNear } from "../useStakeNear";
import { READ_NEAR_CONTRACT_QK } from "../useReadHOSContract";
import { STAKED_BALANCE_QK } from "../useStakedBalance";

// Mock the hooks
vi.mock("@/hooks/useWriteHOSContract", () => ({
  useWriteHOSContract: vi.fn(),
}));

const mockUseWriteHOSContract = vi.mocked(useWriteHOSContract);

describe("useStakeNear", () => {
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
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      expect(result.current.isStakingNear).toBe(false);
      expect(result.current.isUnstakingNear).toBe(false);
      expect(result.current.isWithdrawingNear).toBe(false);
      expect(result.current.stakingNearError).toBeNull();
      expect(result.current.unstakingNearError).toBeNull();
      expect(result.current.withdrawingNearError).toBeNull();
    });

    it("should call useWriteHOSContract with correct parameters", () => {
      renderHook(() => useStakeNear({ lockupAccountId: mockLockupAccountId }), {
        wrapper,
      });

      expect(mockUseWriteHOSContract).toHaveBeenCalledWith({
        contractType: "LOCKUP",
      });
    });
  });

  describe("stakeNear", () => {
    it("should call mutateAsync with correct parameters", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000"; // 1 NEAR in yoctoNEAR

      await act(async () => {
        await result.current.stakeNear(amount);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "deposit_and_stake",
            args: { amount },
          },
        ],
      });
    });

    it("should set loading state correctly during staking", async () => {
      let resolvePromise: (value: any) => void;
      const mutatePromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockMutateAsync.mockReturnValue(mutatePromise);

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000";

      act(() => {
        result.current.stakeNear(amount);
      });

      // Should be loading
      expect(result.current.isStakingNear).toBe(true);
      expect(result.current.stakingNearError).toBeNull();

      await act(async () => {
        resolvePromise({ success: true });
        await mutatePromise;
      });

      // Should no longer be loading
      expect(result.current.isStakingNear).toBe(false);
    });

    it("should handle staking errors correctly", async () => {
      const mockError = new Error("Staking failed");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.stakeNear("1000000000000000000000000");
      });

      expect(result.current.stakingNearError).toBe(mockError);
      expect(result.current.isStakingNear).toBe(false);
    });

    it("should invalidate queries on successful staking", async () => {
      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.stakeNear("1000000000000000000000000");
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: [READ_NEAR_CONTRACT_QK, mockLockupAccountId],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: [STAKED_BALANCE_QK, mockLockupAccountId],
      });
    });
  });

  describe("unstakeNear", () => {
    it("should call mutateAsync with correct parameters", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000"; // 1 NEAR in yoctoNEAR

      await act(async () => {
        await result.current.unstakeNear(amount);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "unstake",
            args: { amount },
          },
        ],
      });
    });

    it("should set loading state correctly during unstaking", async () => {
      let resolvePromise: (value: any) => void;
      const mutatePromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockMutateAsync.mockReturnValue(mutatePromise);

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000";

      act(() => {
        result.current.unstakeNear(amount);
      });

      // Should be loading
      expect(result.current.isUnstakingNear).toBe(true);
      expect(result.current.unstakingNearError).toBeNull();

      await act(async () => {
        resolvePromise({ success: true });
        await mutatePromise;
      });

      // Should no longer be loading
      expect(result.current.isUnstakingNear).toBe(false);
    });

    it("should handle unstaking errors correctly", async () => {
      const mockError = new Error("Unstaking failed");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.unstakeNear("1000000000000000000000000");
      });

      expect(result.current.unstakingNearError).toBe(mockError);
      expect(result.current.isUnstakingNear).toBe(false);
    });

    it("should invalidate queries on successful unstaking", async () => {
      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.unstakeNear("1000000000000000000000000");
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: [READ_NEAR_CONTRACT_QK, mockLockupAccountId],
      });
    });
  });

  describe("withdrawNear", () => {
    it("should call mutateAsync with correct parameters", async () => {
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000"; // 1 NEAR in yoctoNEAR

      await act(async () => {
        await result.current.withdrawNear(amount);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        contractId: mockLockupAccountId,
        methodCalls: [
          {
            methodName: "withdraw_from_staking_pool",
            args: { amount },
          },
        ],
      });
    });

    it("should set loading state correctly during withdrawal", async () => {
      let resolvePromise: (value: any) => void;
      const mutatePromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockMutateAsync.mockReturnValue(mutatePromise);

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      const amount = "1000000000000000000000000";

      act(() => {
        result.current.withdrawNear(amount);
      });

      // Should be loading
      expect(result.current.isWithdrawingNear).toBe(true);
      expect(result.current.withdrawingNearError).toBeNull();

      await act(async () => {
        resolvePromise({ success: true });
        await mutatePromise;
      });

      // Should no longer be loading
      expect(result.current.isWithdrawingNear).toBe(false);
    });

    it("should handle withdrawal errors correctly", async () => {
      const mockError = new Error("Withdrawal failed");
      mockMutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.withdrawNear("1000000000000000000000000");
      });

      expect(result.current.withdrawingNearError).toBe(mockError);
      expect(result.current.isWithdrawingNear).toBe(false);
    });

    it("should invalidate queries on successful withdrawal", async () => {
      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      mockMutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(
        () => useStakeNear({ lockupAccountId: mockLockupAccountId }),
        { wrapper }
      );

      await act(async () => {
        await result.current.withdrawNear("1000000000000000000000000");
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: [READ_NEAR_CONTRACT_QK, mockLockupAccountId],
      });
    });
  });
});
