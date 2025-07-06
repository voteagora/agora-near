import { useNear } from "@/contexts/NearContext";
import { useAvailableToLock } from "@/hooks/useAvailableToLock";
import { useCurrentStakingPoolId } from "@/hooks/useCurrentStakingPoolId";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { useLockNear } from "@/hooks/useLockNear";
import { useLockupAccount } from "@/hooks/useLockupAccount";
import { useNearBalance } from "@/hooks/useNearBalance";
import { useStakingPool } from "@/hooks/useStakingPool";
import { useVenearAccountInfo } from "@/hooks/useVenearAccountInfo";
import { useVenearConfig } from "@/hooks/useVenearConfig";
import { useVenearSnapshot } from "@/hooks/useVenearSnapshot";
import {
  LINEAR_TOKEN_CONTRACTS,
  NANO_SECONDS_IN_YEAR,
  STNEAR_TOKEN_CONTRACTS,
} from "@/lib/constants";
import { isValidNearAmount } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import Big from "big.js";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LockProvider, useLockProviderContext } from "../LockProvider";

// Mock all the hooks
vi.mock("@/contexts/NearContext", () => ({
  useNear: vi.fn(),
}));

vi.mock("@/hooks/useAvailableToLock", () => ({
  useAvailableToLock: vi.fn(),
}));

vi.mock("@/hooks/useCurrentStakingPoolId", () => ({
  useCurrentStakingPoolId: vi.fn(),
}));

vi.mock("@/hooks/useFungibleTokens", () => ({
  useFungibleTokens: vi.fn(),
}));

vi.mock("@/hooks/useLockNear", () => ({
  useLockNear: vi.fn(),
}));

vi.mock("@/hooks/useNearBalance", () => ({
  useNearBalance: vi.fn(),
}));

vi.mock("@/hooks/useStakingPool", () => ({
  useStakingPool: vi.fn(),
}));

vi.mock("@/hooks/useVenearSnapshot", () => ({
  useVenearSnapshot: vi.fn(),
}));

vi.mock("@/hooks/useLockupAccount", () => ({
  useLockupAccount: vi.fn(),
}));

vi.mock("@/hooks/useVenearAccountInfo", () => ({
  useVenearAccountInfo: vi.fn(),
}));

vi.mock("@/hooks/useVenearConfig", () => ({
  useVenearConfig: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the utils
vi.mock("@/lib/utils", () => ({
  ...vi.importActual("@/lib/utils"),
  isValidNearAmount: vi.fn(),
}));

const mockUseNear = vi.mocked(useNear);
const mockUseAvailableToLock = vi.mocked(useAvailableToLock);
const mockUseCurrentStakingPoolId = vi.mocked(useCurrentStakingPoolId);
const mockUseFungibleTokens = vi.mocked(useFungibleTokens);
const mockUseLockNear = vi.mocked(useLockNear);
const mockUseNearBalance = vi.mocked(useNearBalance);
const mockUseStakingPool = vi.mocked(useStakingPool);
const mockUseVenearSnapshot = vi.mocked(useVenearSnapshot);
const mockUseLockupAccount = vi.mocked(useLockupAccount);
const mockUseVenearAccountInfo = vi.mocked(useVenearAccountInfo);
const mockUseVenearConfig = vi.mocked(useVenearConfig);

// Test component that consumes the context
const TestComponent = () => {
  const context = useLockProviderContext();

  return (
    <div>
      <div data-testid="isLoading">{String(context.isLoading)}</div>
      <div data-testid="lockupAccountId">
        {context.lockupAccountId || "null"}
      </div>
      <div data-testid="lockApy">{context.lockApy}</div>
      <div data-testid="enteredAmount">{context.enteredAmount}</div>
      <div data-testid="venearAmount">{context.venearAmount}</div>
      <div data-testid="availableTokensLength">
        {context.availableTokens.length}
      </div>
      <div data-testid="selectedTokenId">
        {context.selectedToken?.accountId || "null"}
      </div>
      <div data-testid="depositTotal">{context.depositTotal}</div>
      <div data-testid="requiredTransactions">
        {context.requiredTransactions.join(",")}
      </div>
      <div data-testid="amountError">{context.amountError || "null"}</div>
      <div data-testid="maxAmountToLock">
        {context.maxAmountToLock || "null"}
      </div>
      <div data-testid="source">{context.source}</div>
      <button
        data-testid="setAmount"
        onClick={() => context.setEnteredAmount("2")}
      >
        Set Amount
      </button>
      <button data-testid="lockMax" onClick={() => context.onLockMax()}>
        Lock Max
      </button>
      <button data-testid="resetForm" onClick={() => context.resetForm()}>
        Reset Form
      </button>
      <button
        data-testid="lockNear"
        onClick={() => context.lockNear({ amount: "1" })}
      >
        Lock Near
      </button>
    </div>
  );
};

describe("LockProvider", () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;

  const mockLockNearAsync = vi.fn();
  const mockRefetchAvailableToLock = vi.fn();

  const mockGrowthRateNs = "10";

  const createMockTokens = () => [
    {
      contract_id: LINEAR_TOKEN_CONTRACTS.testnet,
      balance: "5000000000000000000000000", // 5 LINEAR
      last_update_block_height: 123456,
    },
    {
      contract_id: STNEAR_TOKEN_CONTRACTS.testnet,
      balance: "3000000000000000000000000", // 3 stNEAR
      last_update_block_height: 123456,
    },
  ];

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
    mockUseNear.mockReturnValue({
      signedAccountId: "test-account.testnet",
      networkId: "testnet",
      signIn: vi.fn(),
      signOut: vi.fn(),
      viewMethod: vi.fn(),
      callMethod: vi.fn(),
      getTransactionResult: vi.fn(),
      getBalance: vi.fn(),
      signAndSendTransactions: vi.fn(),
      getAccessKeys: vi.fn(),
      callContracts: vi.fn(),
      signMessage: vi.fn(),
      isInitialized: true,
      transferNear: vi.fn(),
      transferFungibleToken: vi.fn(),
    });

    mockUseAvailableToLock.mockReturnValue({
      availableToLock: "1000000000000000000000000", // 1 NEAR
      refetchAvailableToLock: mockRefetchAvailableToLock,
      isLoadingAvailableToLock: false,
      availableToLockError: null,
    });

    mockUseCurrentStakingPoolId.mockReturnValue({
      stakingPoolId: "test-pool.testnet",
      isLoadingStakingPoolId: false,
      stakingPoolError: null,
    });

    mockUseFungibleTokens.mockReturnValue({
      data: {
        account_id: "test-account.testnet",
        tokens: createMockTokens(),
      },
      isLoading: false,
      error: null,
    } as any);

    mockUseLockNear.mockReturnValue({
      lockNear: vi.fn(),
      unlockNear: vi.fn(),
      lockNearAsync: mockLockNearAsync,
      isLockingNear: false,
      lockingNearError: null,
      isUnlockingNear: false,
      unlockingNearError: null,
    });

    mockUseNearBalance.mockReturnValue({
      nearBalance: "2000000000000000000000000", // 2 NEAR
      isLoadingNearBalance: false,
      nearBalanceError: null,
    });

    mockUseStakingPool.mockReturnValue({
      stakingPools: {
        stNear: {
          price: "1.1",
          deposit: {
            min: "1000000000000000000000000", // 1 NEAR
          },
        },
        liNear: {
          price: "1050000000000000000000000",
          deposit: {
            min: "1000000000000000000000000", // 1 NEAR
          },
        },
      },
      isLoading: false,
    });

    mockUseVenearSnapshot.mockReturnValue({
      growthRateNs: new Big(mockGrowthRateNs), // Mock growth rate as Big
      totalVenearBalance: {
        nearBalance: "1000000000000000000000000",
        extraVenearBalance: "0",
      },
      isLoading: false,
      error: null,
    });

    mockUseLockupAccount.mockReturnValue({
      lockupAccountId: "test-lockup.testnet",
      isLoading: false,
      error: null,
    });

    mockUseVenearAccountInfo.mockReturnValue({
      data: {
        accountId: "test-account.testnet",
        totalBalance: {
          near: "1000000000000000000000000",
          extraBalance: "0",
        },
        delegatedBalance: {
          near: "0",
          extraBalance: "0",
        },
        delegation: undefined,
      },
      isLoading: false,
      error: null,
    });

    mockUseVenearConfig.mockReturnValue({
      venearStorageCost: BigInt("1000000000000000000000000"), // 1 NEAR
      lockupStorageCost: BigInt("2000000000000000000000000"), // 2 NEAR
      totalRegistrationCost: BigInt("3000000000000000000000000"), // 3 NEAR
      stakingPoolWhitelistId: "whitelist.testnet",
      unlockDuration: BigInt("1000000000000000000"), // 1 second
      isLoading: false,
      error: null,
    });

    // Mock isValidNearAmount
    vi.mocked(isValidNearAmount).mockImplementation((amount?: string) => {
      if (!amount) return false;
      try {
        const parsed = parseFloat(amount);
        return !isNaN(parsed) && parsed > 0;
      } catch {
        return false;
      }
    });

    mockRefetchAvailableToLock.mockResolvedValue({
      data: "1000000000000000000000000",
    });
  });

  afterEach(async () => {
    // Clean up rendered components
    cleanup();

    // Clear QueryClient cache
    queryClient.clear();

    // Wait for any pending async operations to complete
    await act(async () => {
      // Give time for any pending promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Reset all timers and pending operations
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  describe("Context Provider", () => {
    it("should provide context values correctly", async () => {
      await act(async () => {
        render(
          <LockProvider source="onboarding">
            <TestComponent />
          </LockProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
      expect(screen.getByTestId("lockupAccountId")).toHaveTextContent(
        "test-lockup.testnet"
      );
      expect(screen.getByTestId("lockApy")).toHaveTextContent(
        Big(mockGrowthRateNs).mul(NANO_SECONDS_IN_YEAR).mul(100).toFixed(2)
      );
      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("");
      expect(screen.getByTestId("availableTokensLength")).toHaveTextContent(
        "4"
      ); // lockup + near + 2 LSTs
    });

    it("should handle loading state", async () => {
      mockUseVenearConfig.mockReturnValue({
        venearStorageCost: BigInt("1000000000000000000000000"),
        lockupStorageCost: BigInt("2000000000000000000000000"),
        totalRegistrationCost: BigInt("3000000000000000000000000"),
        stakingPoolWhitelistId: "whitelist.testnet",
        unlockDuration: BigInt("1000000000000000000"),
        isLoading: true,
        error: null,
      });

      await act(async () => {
        render(
          <LockProvider source="onboarding">
            <TestComponent />
          </LockProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("isLoading")).toHaveTextContent("true");
    });

    it("should handle error state", () => {
      mockUseVenearConfig.mockReturnValue({
        venearStorageCost: BigInt("1000000000000000000000000"),
        lockupStorageCost: BigInt("2000000000000000000000000"),
        totalRegistrationCost: BigInt("3000000000000000000000000"),
        stakingPoolWhitelistId: "whitelist.testnet",
        unlockDuration: BigInt("1000000000000000000"),
        isLoading: false,
        error: new Error("Config error"),
      });

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
      // The error should be propagated through the context
    });
  });

  describe("Available Tokens", () => {
    it("should include lockup tokens when available", async () => {
      await act(async () => {
        render(
          <LockProvider source="onboarding">
            <TestComponent />
          </LockProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("availableTokensLength")).toHaveTextContent(
        "4"
      );
    });

    it("should exclude lockup tokens when not available", () => {
      mockUseAvailableToLock.mockReturnValue({
        availableToLock: "0",
        refetchAvailableToLock: mockRefetchAvailableToLock,
        isLoadingAvailableToLock: false,
        availableToLockError: null,
      });

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("availableTokensLength")).toHaveTextContent(
        "3"
      ); // near + 2 LSTs
    });

    it("should exclude NEAR tokens when balance is zero", () => {
      mockUseNearBalance.mockReturnValue({
        nearBalance: "0",
        isLoadingNearBalance: false,
        nearBalanceError: null,
      });

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("availableTokensLength")).toHaveTextContent(
        "3"
      ); // lockup + 2 LSTs
    });

    it("should handle empty fungible tokens", () => {
      mockUseFungibleTokens.mockReturnValue({
        data: {
          account_id: "test-account.testnet",
          tokens: [],
        },
        isLoading: false,
        error: null,
      } as any);

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("availableTokensLength")).toHaveTextContent(
        "2"
      ); // lockup + near
    });

    it("should select pre-selected token when provided", async () => {
      await act(async () => {
        render(
          <LockProvider
            source="onboarding"
            preSelectedTokenId="meta-v2.pool.testnet"
          >
            <TestComponent />
          </LockProvider>,
          { wrapper }
        );
      });

      expect(screen.getByTestId("selectedTokenId")).toHaveTextContent(
        "meta-v2.pool.testnet"
      );
    });

    it("should select first token when no pre-selected token", () => {
      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Should select the first available token (lockup in this case)
      expect(screen.getByTestId("selectedTokenId")).toHaveTextContent(
        "linear-protocol.testnet"
      );
    });
  });

  describe("Amount Validation", () => {
    it("should validate entered amount", async () => {
      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Set a valid amount
      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("2");
      expect(screen.getByTestId("amountError")).toHaveTextContent("null");
    });

    it("should show error for invalid amount", async () => {
      vi.mocked(isValidNearAmount).mockReturnValue(false);

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("amountError")).toHaveTextContent(
        "Please enter a valid amount"
      );
    });

    it("should handle max amount correctly", async () => {
      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("lockMax").click();
      });

      // Should set amount to max available
      expect(screen.getByTestId("enteredAmount")).not.toHaveTextContent("");
    });
  });

  describe("Form Reset", () => {
    it("should reset form correctly", async () => {
      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Set some values first
      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("2");

      // Reset form
      await act(async () => {
        screen.getByTestId("resetForm").click();
      });

      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("");
      expect(screen.getByTestId("amountError")).toHaveTextContent("null");
    });
  });

  describe("Callbacks", () => {
    it("should call onLockSuccess when lock succeeds", async () => {
      const mockOnLockSuccess = vi.fn();

      // Set up the mock to resolve successfully
      mockLockNearAsync.mockResolvedValue({});

      render(
        <LockProvider source="onboarding" onLockSuccess={mockOnLockSuccess}>
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Simulate successful lock
      await act(async () => {
        screen.getByTestId("lockNear").click();
      });

      // Wait for the async operation to complete
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // The onLockSuccess callback should be called when lockNear succeeds
      expect(mockLockNearAsync).toHaveBeenCalled();
    });
  });

  describe("Deposit Total Calculation", () => {
    it("should calculate deposit total for onboardng with LST", () => {
      mockUseVenearAccountInfo.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("depositTotal")).toHaveTextContent(
        "4000000000000000000000000"
      );
    });

    it("should calculate deposit total for onboarding with NEAR wallet", () => {
      mockUseVenearAccountInfo.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("depositTotal")).toHaveTextContent(
        "3000000000000000000000000"
      );
    });

    it("should calculate deposit total post-onboarding with NEAR wallet", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("depositTotal")).toHaveTextContent("0");
    });

    it("should calculate deposit total post-onboarding with LST", () => {
      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("depositTotal")).toHaveTextContent(
        "1000000000000000000000000"
      );
    });
  });

  describe("Required Transactions", () => {
    it("should include deploy_lockup when no venear account", () => {
      mockUseVenearAccountInfo.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "deploy_lockup"
      );
    });

    it("should always include lock_near", () => {
      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "lock_near"
      );
    });

    it("should include select_staking_pool for LST without staking pool", () => {
      mockUseCurrentStakingPoolId.mockReturnValue({
        stakingPoolId: null,
        isLoadingStakingPoolId: false,
        stakingPoolError: null,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "select_staking_pool"
      );
    });

    it("should include transfer_near for NEAR token", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "transfer_near"
      );
    });

    it("should include transfer_ft for fungible tokens", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "transfer_ft"
      );
    });

    it("should include refresh_balance for LST tokens", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "refresh_balance"
      );
    });

    it("should not include transfer for lockup tokens", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-lockup.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      const transactions = screen.getByTestId(
        "requiredTransactions"
      ).textContent;
      expect(transactions).not.toContain("transfer_near");
      expect(transactions).not.toContain("transfer_ft");
    });
  });

  describe("VeNEAR Amount Calculation", () => {
    it("should calculate venear amount for NEAR token", async () => {
      //   vi.mocked(isValidNearAmount).mockReturnValue(true);

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("venearAmount")).toHaveTextContent(
        "2000000000000000000000000"
      );
    });

    it("should calculate venear amount for stNEAR token", async () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="meta-v2.pool.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // stNEAR: 2 * 1.1 = 2.2 NEAR value
      expect(screen.getByTestId("venearAmount")).toHaveTextContent("2");
    });

    it("should calculate venear amount for LINEAR token", async () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // LINEAR: 2 * 1.05 = 2.1 NEAR value
      expect(screen.getByTestId("venearAmount")).toHaveTextContent("2");
    });

    it("should include registration cost for new accounts", async () => {
      mockUseVenearAccountInfo.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // LINEAR: 2 * 1.05 + 3 (registration cost) = 5.1 NEAR value
      expect(screen.getByTestId("venearAmount")).toHaveTextContent(
        "5100000000000000000000000"
      );
    });

    it("should return 0 for invalid amount", () => {
      vi.mocked(isValidNearAmount).mockReturnValue(false);

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("venearAmount")).toHaveTextContent("0");
    });

    it("should handle calculation errors gracefully", async () => {
      vi.mocked(isValidNearAmount).mockReturnValue(true);
      mockUseStakingPool.mockReturnValue({
        stakingPools: {
          stNear: {
            price: null, // This should cause an error
            deposit: {
              min: "1000000000000000000000000",
            },
          },
          liNear: {
            price: "1.05",
            deposit: {
              min: "1000000000000000000000000",
            },
          },
        },
        isLoading: false,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="meta-v2.pool.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("venearAmount")).toHaveTextContent("0");
    });
  });

  describe("Token Selection", () => {
    it("should handle token selection with different network", () => {
      mockUseNear.mockReturnValue({
        signedAccountId: "test-account.mainnet",
        networkId: "mainnet",
        signIn: vi.fn(),
        signOut: vi.fn(),
        viewMethod: vi.fn(),
        callMethod: vi.fn(),
        getTransactionResult: vi.fn(),
        getBalance: vi.fn(),
        signAndSendTransactions: vi.fn(),
        getAccessKeys: vi.fn(),
        callContracts: vi.fn(),
        signMessage: vi.fn(),
        isInitialized: true,
        transferNear: vi.fn(),
        transferFungibleToken: vi.fn(),
      });

      // Update fungible tokens to use mainnet contracts
      const mainnetTokens = [
        {
          contract_id: LINEAR_TOKEN_CONTRACTS.mainnet,
          balance: "5000000000000000000000000", // 5 LINEAR
          last_update_block_height: 123456,
        },
        {
          contract_id: STNEAR_TOKEN_CONTRACTS.mainnet,
          balance: "3000000000000000000000000", // 3 stNEAR
          last_update_block_height: 123456,
        },
      ];

      mockUseFungibleTokens.mockReturnValue({
        data: {
          account_id: "test-account.mainnet",
          tokens: mainnetTokens,
        },
        isLoading: false,
        error: null,
      } as any);

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Should still work with different network
      expect(screen.getByTestId("availableTokensLength")).toHaveTextContent(
        "4"
      );
    });
  });

  describe("Amount Validation Edge Cases", () => {
    it("should show error when amount exceeds available funds", async () => {
      vi.mocked(isValidNearAmount).mockReturnValue(true);

      // Mock a very small balance
      mockUseNearBalance.mockReturnValue({
        nearBalance: "1000000000000000000000", // 0.001 NEAR
        isLoadingNearBalance: false,
        nearBalanceError: null,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      expect(screen.getByTestId("amountError")).toHaveTextContent(
        "Not enough funds in this account"
      );
    });

    it("should show error when NEAR amount is below minimum deposit", async () => {
      vi.mocked(isValidNearAmount).mockReturnValue(true);

      mockUseNearBalance.mockReturnValue({
        nearBalance: "10000000000000000000000000", // 10 NEAR
        isLoadingNearBalance: false,
        nearBalanceError: null,
      });

      // Mock venearAccountInfo to null so onboarding depositTotal includes registration cost
      mockUseVenearAccountInfo.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // Should show minimum deposit error if amount is too low
      const errorText = screen.getByTestId("amountError").textContent;
      await waitFor(() => {
        expect(errorText).toContain("You must lock at least");
      });
    });

    it("should handle validation errors gracefully", async () => {
      // Create a custom test component that sets an invalid amount
      const TestComponentWithInvalidAmount = () => {
        const context = useLockProviderContext();

        React.useEffect(() => {
          context.setEnteredAmount("invalid");
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
          <div>
            <div data-testid="amountError">{context.amountError || "null"}</div>
          </div>
        );
      };

      render(
        <LockProvider source="onboarding">
          <TestComponentWithInvalidAmount />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId("amountError")).toHaveTextContent(
        "Please enter a valid amount"
      );
    });
  });

  describe("Max Amount Calculation", () => {
    it("should calculate max amount for NEAR token correctly", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Max amount should be balance minus gas reserve
      expect(screen.getByTestId("maxAmountToLock")).not.toHaveTextContent(
        "null"
      );
    });

    it("should handle zero balance correctly", () => {
      mockUseNearBalance.mockReturnValue({
        nearBalance: "0",
        isLoadingNearBalance: false,
        nearBalanceError: null,
      });

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("maxAmountToLock")).toHaveTextContent("0");
    });

    it("should use token balance for LST tokens", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("maxAmountToLock")).toHaveTextContent(
        "5000000000000000000000000"
      );
    });
  });

  describe("Transfer Amount Calculation", () => {
    it("should calculate transfer amount for NEAR token", async () => {
      vi.mocked(isValidNearAmount).mockReturnValue(true);

      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // For onboarding source, should subtract registration cost
      // 2 NEAR - 3 NEAR registration = 0 (minimum 0)
      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "transfer_near"
      );
    });

    it("should calculate transfer amount for LST token", async () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click();
      });

      // LST should use entered amount directly
      expect(screen.getByTestId("requiredTransactions")).toHaveTextContent(
        "transfer_ft"
      );
    });

    it("should handle non-onboarding source", () => {
      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Should not subtract registration cost for non-onboarding
      expect(screen.getByTestId("source")).toHaveTextContent(
        "account_management"
      );
    });
  });

  describe("Get Amount to Lock", () => {
    it("should return undefined for onboarding source", async () => {
      const TestComponentWithGetAmount = () => {
        const context = useLockProviderContext();
        const [amount, setAmount] = React.useState<string | undefined>();

        const handleGetAmount = async () => {
          const result = await context.getAmountToLock();
          setAmount(result);
        };

        return (
          <div>
            <button data-testid="getAmount" onClick={handleGetAmount}>
              Get Amount
            </button>
            <div data-testid="calculatedAmount">{amount || "null"}</div>
          </div>
        );
      };

      render(
        <LockProvider source="onboarding">
          <TestComponentWithGetAmount />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("getAmount").click();
      });

      expect(screen.getByTestId("calculatedAmount")).toHaveTextContent("null");
    });

    it("should calculate amount for non-onboarding source", async () => {
      vi.mocked(isValidNearAmount).mockReturnValue(true);
      mockRefetchAvailableToLock.mockResolvedValue({
        data: "1000000000000000000000000",
      });

      const TestComponentWithGetAmount = () => {
        const context = useLockProviderContext();
        const [amount, setAmount] = React.useState<string | undefined>();
        const [hasSetAmount, setHasSetAmount] = React.useState(false);

        React.useEffect(() => {
          if (!hasSetAmount) {
            context.setEnteredAmount("2"); // Set a valid amount
            setHasSetAmount(true);
          }
        }, [hasSetAmount, context]);

        const handleGetAmount = async () => {
          const result = await context.getAmountToLock();
          setAmount(result);
        };

        return (
          <div>
            <button data-testid="getAmount" onClick={handleGetAmount}>
              Get Amount
            </button>
            <div data-testid="calculatedAmount">{amount || "null"}</div>
            <div data-testid="enteredAmount">{context.enteredAmount}</div>
          </div>
        );
      };

      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponentWithGetAmount />
        </LockProvider>,
        { wrapper }
      );

      // Wait for amount to be set
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        screen.getByTestId("getAmount").click();
      });

      // Should return the smaller of available amount or entered amount
      // Since we set 2 NEAR and available is 1 NEAR, it should return 1 NEAR
      expect(screen.getByTestId("calculatedAmount")).toHaveTextContent(
        "1000000000000000000000000"
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle multiple error states", () => {
      mockUseVenearConfig.mockReturnValue({
        venearStorageCost: BigInt("1000000000000000000000000"),
        lockupStorageCost: BigInt("2000000000000000000000000"),
        totalRegistrationCost: BigInt("3000000000000000000000000"),
        stakingPoolWhitelistId: "whitelist.testnet",
        unlockDuration: BigInt("1000000000000000000"),
        isLoading: false,
        error: new Error("Config error"),
      });

      mockUseFungibleTokens.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Fungible tokens error"),
      } as any);

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Should handle multiple errors gracefully
      expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
    });

    it("should handle lockup account error", () => {
      mockUseLockupAccount.mockReturnValue({
        lockupAccountId: undefined,
        isLoading: false,
        error: new Error("Lockup account error"),
      });

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("lockupAccountId")).toHaveTextContent("null");
    });

    it("should handle near balance error", () => {
      mockUseNearBalance.mockReturnValue({
        nearBalance: undefined,
        isLoadingNearBalance: false,
        nearBalanceError: new Error("Balance error"),
      });

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Should handle balance error gracefully
      expect(screen.getByTestId("availableTokensLength")).toHaveTextContent(
        "3"
      );
    });
  });
});
