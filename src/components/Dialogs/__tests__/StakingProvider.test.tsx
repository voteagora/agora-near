import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { useStakingPoolExchangeRates } from "@/hooks/useStakingPoolExchangeRates";
import { useStakingPoolStats } from "@/hooks/useStakingPoolStats";
import { LINEAR_POOL, STNEAR_POOL } from "@/lib/constants";
import * as utils from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, screen } from "@testing-library/react";
import { utils as nearUtils } from "near-api-js";
import React, { memo, useCallback } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StakingProvider, useStakingProviderContext } from "../StakingProvider";

// Mock all the hooks
vi.mock("@/hooks/useCurrentStakingPoolId", () => ({
  useCurrentStakingPoolId: vi.fn(),
}));

vi.mock("@/hooks/useLockupAccount", () => ({
  useLockupAccount: vi.fn(),
}));

vi.mock("@/hooks/useReadHOSContract", () => ({
  useReadHOSContract: vi.fn(),
}));

vi.mock("@/hooks/useStakingPoolExchangeRates", () => ({
  useStakingPoolExchangeRates: vi.fn(),
}));

vi.mock("@/hooks/useStakingPoolStats", () => ({
  useStakingPoolStats: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUseCurrentStakingPoolId = vi.mocked(useCurrentStakingPoolId);
const mockUseLockupAccount = vi.mocked(useLockupAccount);
const mockUseReadHOSContract = vi.mocked(useReadHOSContract);
const mockUseStakingPoolExchangeRates = vi.mocked(useStakingPoolExchangeRates);
const mockUseStakingPoolStats = vi.mocked(useStakingPoolStats);

// Test component that consumes the context
const TestComponent = memo(() => {
  const context = useStakingProviderContext();

  const handleSetSelectedPool = useCallback(() => {
    context.setSelectedPool(STNEAR_POOL);
  }, [context]);

  const handleSetAmount = useCallback(() => {
    context.setEnteredAmount("5");
  }, [context]);

  const handleSetInvalidAmount = useCallback(() => {
    context.setEnteredAmount("invalid");
  }, [context]);

  const handleSetLargeAmount = useCallback(() => {
    context.setEnteredAmount("100000000000000000000000000"); // 100 NEAR
  }, [context]);

  const handleStakeMax = useCallback(() => {
    context.onStakeMax();
  }, [context]);

  const handleResetForm = useCallback(() => {
    context.resetForm();
  }, [context]);

  return (
    <div>
      <div data-testid="isLoading">{String(context.isLoading)}</div>
      <div data-testid="error">{context.error?.message || "null"}</div>
      <div data-testid="lockupAccountId">
        {context.lockupAccountId || "null"}
      </div>
      <div data-testid="currentStakingPoolId">
        {context.currentStakingPoolId || "null"}
      </div>
      <div data-testid="selectedPoolId">{context.selectedPool.id}</div>
      <div data-testid="enteredAmount">{context.enteredAmount}</div>
      <div data-testid="isStakingMax">{String(context.isStakingMax)}</div>
      <div data-testid="maxStakingAmount">{context.maxStakingAmount}</div>
      <div data-testid="amountError">{context.amountError}</div>
      <div data-testid="amountInStakingToken">
        {context.amountInStakingToken}
      </div>
      <div data-testid="enteredAmountYoctoNear">
        {context.enteredAmountYoctoNear}
      </div>
      <div data-testid="poolsLength">{context.pools.length}</div>
      <div data-testid="poolStatsLinearApy">
        {context.poolStats[LINEAR_POOL.id]?.apy}
      </div>
      <div data-testid="poolStatsStNearApy">
        {context.poolStats[STNEAR_POOL.id]?.apy}
      </div>
      <div data-testid="source">{context.source}</div>
      <div data-testid="hasAlreadySelectedStakingPool">
        {String(context.hasAlreadySelectedStakingPool)}
      </div>
      <button data-testid="setSelectedPool" onClick={handleSetSelectedPool}>
        Set Selected Pool
      </button>
      <button data-testid="setAmount" onClick={handleSetAmount}>
        Set Amount to 5 NEAR
      </button>
      <button data-testid="setInvalidAmount" onClick={handleSetInvalidAmount}>
        Set Invalid Amount
      </button>
      <button data-testid="setLargeAmount" onClick={handleSetLargeAmount}>
        Set Large Amount
      </button>
      <button data-testid="stakeMax" onClick={handleStakeMax}>
        Stake Max
      </button>
      <button data-testid="resetForm" onClick={handleResetForm}>
        Reset Form
      </button>
    </div>
  );
});

TestComponent.displayName = "TestComponent";

describe("StakingProvider", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;

  const mockExchangeRateMap = {
    [LINEAR_POOL.id]: "2000000000000000000000000", // 2 NEAR per LINEAR
    [STNEAR_POOL.id]: "4000000000000000000000000", // 4 NEAR per stNEAR
  };

  const mockStats = {
    [LINEAR_POOL.id]: {
      apy: 0.08, // 8%
      supply: "1000000000000000000000000000", // 1000 LINEAR
    },
    [STNEAR_POOL.id]: {
      apy: 0.09, // 9%
      supply: "2000000000000000000000000000", // 2000 stNEAR
    },
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

    // Setup default mocks
    mockUseLockupAccount.mockReturnValue({
      lockupAccountId: "test-lockup.testnet",
      isLoading: false,
      error: null,
    });

    mockUseStakingPoolExchangeRates.mockReturnValue({
      exchangeRateMap: mockExchangeRateMap,
      isLoading: false,
    });

    // Mock max staking amount contract call
    mockUseReadHOSContract.mockReturnValue([
      {
        data: "10000000000000000000000000", // 10 NEAR
        isLoading: false,
        error: null,
      },
    ] as any);

    mockUseCurrentStakingPoolId.mockReturnValue({
      stakingPoolId: "test-pool.testnet",
      isLoadingStakingPoolId: false,
      stakingPoolError: null,
    });

    mockUseStakingPoolStats.mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
    });
  });

  afterEach(async () => {
    cleanup();
    queryClient.clear();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  describe("Context Provider", () => {
    it("should provide context values correctly", async () => {
      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
      expect(screen.getByTestId("lockupAccountId")).toHaveTextContent(
        "test-lockup.testnet"
      );
      expect(screen.getByTestId("currentStakingPoolId")).toHaveTextContent(
        "test-pool.testnet"
      );
      expect(screen.getByTestId("selectedPoolId")).toHaveTextContent(
        LINEAR_POOL.id
      );
      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("");
      expect(screen.getByTestId("isStakingMax")).toHaveTextContent("false");
      expect(screen.getByTestId("maxStakingAmount")).toHaveTextContent("10");
      expect(screen.getByTestId("poolsLength")).toHaveTextContent("2");
      expect(screen.getByTestId("source")).toHaveTextContent("onboarding");
      expect(
        screen.getByTestId("hasAlreadySelectedStakingPool")
      ).toHaveTextContent("false");
    });

    it("should return the staking source", async () => {
      await act(async () => {
        render(
          <StakingProvider source="account_management">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("source")).toHaveTextContent(
        "account_management"
      );
    });

    it("should handle loading state", async () => {
      mockUseLockupAccount.mockReturnValue({
        lockupAccountId: "test-lockup.testnet",
        isLoading: true,
        error: null,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("isLoading")).toHaveTextContent("true");
    });

    it("should handle error state", async () => {
      const mockError = new Error("Test error");
      mockUseLockupAccount.mockReturnValue({
        lockupAccountId: undefined,
        isLoading: false,
        error: mockError,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("error")).toHaveTextContent("Test error");
    });

    it("should handle prefilled amount", async () => {
      await act(async () => {
        render(
          <StakingProvider source="onboarding" prefilledAmount="2.5">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("2.5");
    });
  });

  describe("Pool Selection", () => {
    it("should select pre-selected staking pool when available", async () => {
      mockUseCurrentStakingPoolId.mockReturnValue({
        stakingPoolId: LINEAR_POOL.contracts.testnet,
        isLoadingStakingPoolId: false,
        stakingPoolError: null,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("selectedPoolId")).toHaveTextContent(
        LINEAR_POOL.id
      );
      expect(
        screen.getByTestId("hasAlreadySelectedStakingPool")
      ).toHaveTextContent("true");
    });

    it("should handle selecting a staking pool", async () => {
      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      // Initially should be LINEAR_POOL
      expect(screen.getByTestId("selectedPoolId")).toHaveTextContent(
        LINEAR_POOL.id
      );

      await act(async () => {
        screen.getByTestId("setSelectedPool").click();
      });

      // Should change to STNEAR_POOL
      expect(screen.getByTestId("selectedPoolId")).toHaveTextContent(
        STNEAR_POOL.id
      );
    });

    it("should handle when no staking pool is selected", async () => {
      mockUseCurrentStakingPoolId.mockReturnValue({
        stakingPoolId: null,
        isLoadingStakingPoolId: false,
        stakingPoolError: null,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(
        screen.getByTestId("hasAlreadySelectedStakingPool")
      ).toHaveTextContent("false");
    });
  });

  describe("Amount Handling", () => {
    it("should handle setting entered amount", async () => {
      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("5");
      expect(screen.getByTestId("isStakingMax")).toHaveTextContent("false");
    });

    it("should calculate yocto NEAR amount correctly", async () => {
      const spy = vi
        .spyOn(nearUtils.format, "parseNearAmount")
        .mockReturnValue("5000000000000000000000000");

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("enteredAmountYoctoNear")).toHaveTextContent(
        "5000000000000000000000000"
      );

      spy.mockRestore();
    });

    it("should calculate amount in staking token correctly", async () => {
      const spy = vi
        .spyOn(nearUtils.format, "parseNearAmount")
        .mockReturnValue("5000000000000000000000000");

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // 5 NEAR / 2 NEAR per LINEAR = 2.5 LINEAR
      expect(screen.getByTestId("amountInStakingToken")).toHaveTextContent(
        "2500000000000000000000000"
      );

      spy.mockRestore();
    });
  });

  describe("Amount Validation", () => {
    it("should not return error for valid amount", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(true);

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("amountError").textContent).toBeFalsy();

      spy.mockRestore();
    });

    it("should return error for invalid amount", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(false);

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setInvalidAmount").click();
      });

      expect(screen.getByTestId("amountError")).toHaveTextContent(
        "Please enter a valid amount"
      );

      spy.mockRestore();
    });

    it("should return error when amount exceeds available balance", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(true);

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setLargeAmount").click();
      });

      expect(screen.getByTestId("amountError")).toHaveTextContent(
        "Amount exceeds available balance"
      );

      spy.mockRestore();
    });

    it("should not return error for initial state", async () => {
      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("amountError").textContent).toBeFalsy();
    });
  });

  describe("Max Staking", () => {
    it("should handle staking max amount", async () => {
      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("stakeMax").click();
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("10");
      expect(screen.getByTestId("isStakingMax")).toHaveTextContent("true");
    });

    it("should not change the entered amount when no max amount available", async () => {
      mockUseReadHOSContract.mockReturnValue([
        {
          data: null,
          isLoading: false,
          error: null,
        },
      ] as any);

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("stakeMax").click();
      });

      // Should not change the entered amount
      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("");
      expect(screen.getByTestId("isStakingMax")).toHaveTextContent("false");
    });
  });

  describe("Form Reset", () => {
    it("should reset form correctly", async () => {
      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      // Set some values first
      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("5");

      // Reset form
      await act(async () => {
        screen.getByTestId("resetForm").click();
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("");
      expect(screen.getByTestId("isStakingMax")).toHaveTextContent("false");
    });
  });

  describe("Pool Stats", () => {
    it("should return pool stats correctly", async () => {
      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      // APY should be converted to percentage (8% -> 8)
      expect(screen.getByTestId("poolStatsLinearApy")).toHaveTextContent("8");
      expect(screen.getByTestId("poolStatsStNearApy")).toHaveTextContent("9");
    });

    it("should handle pool stats error", async () => {
      const mockError = new Error("Stats error");
      mockUseStakingPoolStats.mockReturnValue({
        stats: {},
        error: mockError,
        isLoading: false,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("error")).toHaveTextContent("Stats error");
    });

    it("should handle empty stats", async () => {
      mockUseStakingPoolStats.mockReturnValue({
        stats: {},
        error: null,
        isLoading: false,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("poolStatsLinearApy")).toHaveTextContent("0");
      expect(screen.getByTestId("poolStatsStNearApy")).toHaveTextContent("0");
    });
  });

  describe("Loading States", () => {
    it("should aggregate loading states correctly", async () => {
      mockUseLockupAccount.mockReturnValue({
        lockupAccountId: "test-lockup.testnet",
        isLoading: true,
        error: null,
      });

      mockUseStakingPoolExchangeRates.mockReturnValue({
        exchangeRateMap: {},
        isLoading: true,
      });

      mockUseStakingPoolStats.mockReturnValue({
        stats: {},
        error: null,
        isLoading: false,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("isLoading")).toHaveTextContent("true");
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple errors and show the first one", async () => {
      const lockupError = new Error("Lockup error");
      const statsError = new Error("Stats error");

      mockUseLockupAccount.mockReturnValue({
        lockupAccountId: undefined,
        isLoading: false,
        error: lockupError,
      });

      mockUseStakingPoolStats.mockReturnValue({
        stats: {},
        error: statsError,
        isLoading: false,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("error")).toHaveTextContent("Lockup error");
    });

    it("should handle empty lockup account ID", async () => {
      mockUseLockupAccount.mockReturnValue({
        lockupAccountId: "",
        isLoading: false,
        error: null,
      });

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("lockupAccountId")).toHaveTextContent("null");
    });

    it("should handle null max staking amount", async () => {
      mockUseReadHOSContract.mockReturnValue([
        {
          data: null,
          isLoading: false,
          error: null,
        },
      ] as any);

      await act(async () => {
        render(
          <StakingProvider source="onboarding">
            <TestComponent />
          </StakingProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("maxStakingAmount").textContent).toBeFalsy();
    });

    it("should handle invalid NEAR amount parsing", async () => {
      const spy = vi
        .spyOn(nearUtils.format, "parseNearAmount")
        .mockReturnValue(null);

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("enteredAmountYoctoNear")).toHaveTextContent(
        "0"
      );

      spy.mockRestore();
    });

    it("should handle missing exchange rates", async () => {
      mockUseStakingPoolExchangeRates.mockReturnValue({
        exchangeRateMap: {},
        isLoading: false,
      });

      render(
        <StakingProvider source="onboarding">
          <TestComponent />
        </StakingProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // Should default to "0" when no exchange rate is available
      expect(screen.getByTestId("amountInStakingToken")).toHaveTextContent("0");
    });
  });
});
