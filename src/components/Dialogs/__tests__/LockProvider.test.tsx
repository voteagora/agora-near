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
import * as utils from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import Big from "big.js";
import React, { useEffect, useState } from "react";
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
  const [amountToLock, setAmountToLock] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    async function getAmountToLock() {
      const result = await context.getAmountToLock();
      setAmountToLock(result);
    }
    getAmountToLock();
  });

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
        {context.selectedToken?.accountId}
      </div>
      <div data-testid="transferAmountYocto">{context.transferAmountYocto}</div>
      <div data-testid="depositTotal">{context.depositTotal}</div>
      <div data-testid="requiredTransactions">
        {context.requiredTransactions.join(",")}
      </div>
      <div data-testid="amountError">{context.amountError}</div>
      <div data-testid="error">{context.error?.message}</div>
      <div data-testid="maxAmountToLock">
        {context.maxAmountToLock || "null"}
      </div>
      <div data-testid="maxAmount">{context.maxAmountToLock}</div>
      <div data-testid="source">{context.source}</div>
      {amountToLock && <div data-testid="amountToLock">{amountToLock}</div>}
      <button
        data-testid="setAmount"
        onClick={() => context.setEnteredAmount("2")}
      >
        Set Amount to 2 NEAR
      </button>
      <button
        data-testid="setSelectedToken"
        onClick={() => context.setSelectedToken(context.availableTokens[1])}
      >
        Set Selected Token
      </button>
      <button
        data-testid="setAmountFourNEAR"
        onClick={() => context.setEnteredAmount("4")}
      >
        Set Amount to 4 NEAR
      </button>
      <button
        data-testid="setAmountInvalid"
        onClick={() => context.setEnteredAmount("invalid")}
      >
        Set Amount to Invalid Amount
      </button>
      <button
        data-testid="setAmountLarge"
        onClick={() => context.setEnteredAmount("100000000000000000000000000")} // 100 NEAR
      >
        Set Amount to Large Amount
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
  const mockOnTokenSelected = vi.fn();
  const mockOnLockSuccess = vi.fn();

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
      lockNearAsync: mockLockNearAsync,
      isLockingNear: false,
      lockingNearError: null,
    });

    mockUseNearBalance.mockReturnValue({
      nearBalance: "2000000000000000000000000", // 2 NEAR
      isLoadingNearBalance: false,
      nearBalanceError: null,
    });

    mockUseStakingPool.mockReturnValue({
      stakingPools: {
        stNear: {
          price: "1100000000000000000000000", // 1.1 NEAR
          deposit: {
            min: "1000000000000000000000000", // 1 NEAR
          },
        },
        liNear: {
          price: "1050000000000000000000000", // 1.05 NEAR
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

      // Should select the first available token
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
      expect(screen.getByTestId("amountError")).toHaveTextContent("");
    });

    it("should show error for invalid amount", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(false);

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

      spy.mockRestore();
    });

    it("should handle max amount correctly when locking NEAR", async () => {
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
        screen.getByTestId("lockMax").click();
      });

      // Should set amount to max available (2 NEAR - 0.2 NEAR gas reserve = 1.8 NEAR)
      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("1.8");
    });

    it("should handle max amount correctly when locking LST", async () => {
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
        screen.getByTestId("lockMax").click();
      });

      // Should set amount to max available (5 liNEAR)
      expect(screen.getByTestId("enteredAmount")).toHaveTextContent("5");
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
      expect(screen.getByTestId("amountError")).toHaveTextContent("");
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

      // Total registration cost + stNear deposit = 3 NEAR + 1 NEAR = 4 NEAR
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

      // Total registration cost = 3 NEAR
      expect(screen.getByTestId("depositTotal")).toHaveTextContent(
        "3000000000000000000000000"
      );
    });

    it("should calculate deposit total after onboarding with NEAR wallet", () => {
      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // No deposit required since lockup is already deployed
      expect(screen.getByTestId("depositTotal")).toHaveTextContent("0");
    });

    it("should calculate deposit total after onboarding with LST", () => {
      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Deposit total = staking pool deposit = 1 NEAR
      expect(screen.getByTestId("depositTotal")).toHaveTextContent(
        "1000000000000000000000000"
      );
    });
  });

  describe("Required Transactions", () => {
    it("should include deploy_lockup when user is not registered with veNEAR contract", () => {
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

    it("should include select_staking_pool when user has not selected a staking pool", () => {
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

    it("should include transfer_near when locking NEAR", () => {
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

    it("should include transfer_ft when locking LST", () => {
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

    it("should include refresh_balance when locking LST", () => {
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

    it("should not include transfer transaction when locking NEAR in lockup account", () => {
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
    it("should calculate correct veNEAR amount when locking NEAR", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(true);

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

      spy.mockRestore();
    });

    it("should calculate correct veNEAR amount when locking stNEAR", async () => {
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

      // stNEAR: 2 stNEAR * 1.1 NEAR/stNEAR rate = 2.2 NEAR/veNEAR
      expect(screen.getByTestId("venearAmount")).toHaveTextContent(
        "2200000000000000000000000"
      );
    });

    it("should calculate correct veNEAR amount when locking liNEAR", async () => {
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

      // liNEAR: 2 liNEAR * 1.05 NEAR/liNEAR rate = 2.1 NEAR/veNEAR
      expect(screen.getByTestId("venearAmount")).toHaveTextContent(
        "2100000000000000000000000"
      );
    });

    it("should include registration cost in the veNEAR calculation for new accounts", async () => {
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
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(false);

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("venearAmount")).toHaveTextContent("0");

      spy.mockRestore();
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
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(true);

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

      spy.mockRestore();
    });

    it("should show error when NEAR amount is below minimum deposit", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(true);

      mockUseNearBalance.mockReturnValue({
        nearBalance: "10000000000000000000000000", // 10 NEAR
        isLoadingNearBalance: false,
        nearBalanceError: null,
      });

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
        screen.getByTestId("setAmount").click(); // 2 NEAR
      });

      // Should show minimum deposit error if amount is too low
      const errorText = screen.getByTestId("amountError").textContent;
      await waitFor(() => {
        expect(errorText).toContain("You must lock at least");
      });

      spy.mockRestore();
    });

    it("should handle invalid amounts", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(false);

      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmountInvalid").click();
      });

      expect(screen.getByTestId("amountError")).toHaveTextContent(
        "Please enter a valid amount"
      );

      spy.mockRestore();
    });

    it("should handle amount that exceeds available balance", async () => {
      render(
        <LockProvider source="onboarding">
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmountLarge").click();
      });

      expect(screen.getByTestId("amountError")).toHaveTextContent(
        "Not enough funds in this account"
      );
    });
  });

  describe("Max Amount Calculation", () => {
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

      expect(screen.getByTestId("maxAmount")).toHaveTextContent("0");
    });

    it("should handle very small balance (below gas reserve)", () => {
      mockUseNearBalance.mockReturnValue({
        nearBalance: "100000000000000000000000", // 0.1 NEAR (below gas reserve)
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

      expect(screen.getByTestId("maxAmount")).toHaveTextContent("0");
    });

    it("should calculate max amount to lock when locking NEAR", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Max amount should be balance minus gas reserve = 2 NEAR - 0.2 NEAR = 1.8 NEAR
      expect(screen.getByTestId("maxAmount")).toHaveTextContent(
        "1800000000000000000000000"
      );
    });

    it("should calculate max amount to lock when locking LST", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Max amount should just be the token balance
      expect(screen.getByTestId("maxAmount")).toHaveTextContent(
        "5000000000000000000000000"
      );
    });
  });

  describe("Transfer Amount Calculation", () => {
    it("should calculate transfer amount for NEAR token", async () => {
      const spy = vi.spyOn(utils, "isValidNearAmount").mockReturnValue(true);

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

      spy.mockRestore();
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

  describe("Callback Functions", () => {
    it("should call onTokenSelected when token is selected", async () => {
      render(
        <LockProvider source="onboarding" onTokenSelected={mockOnTokenSelected}>
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setSelectedToken").click();
      });

      expect(mockOnTokenSelected).toHaveBeenCalled();
    });

    it("should call onLockSuccess when lock succeeds", async () => {
      render(
        <LockProvider source="onboarding" onLockSuccess={mockOnLockSuccess}>
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      // Simulate success callback
      mockUseLockNear.mock.calls[0][0].onSuccess?.();

      expect(mockOnLockSuccess).toHaveBeenCalled();
    });
  });

  describe("Transfer amount calculations", () => {
    it("should calculate transferAmountYocto for LST tokens during onboarding", async () => {
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
        screen.getByTestId("setAmount").click(); // 2 liNEAR
      });

      // Amount to transfer is 1:1 with amount to lock (2 liNEAR)
      expect(screen.getByTestId("transferAmountYocto")).toHaveTextContent(
        "2000000000000000000000000"
      );
      expect(screen.getByTestId("selectedTokenId")).toHaveTextContent(
        "linear-protocol.testnet"
      );
    });

    it("should calculate transferAmountYocto for LST tokens post-onboarding", async () => {
      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click(); // 2 liNEAR
      });

      expect(screen.getByTestId("transferAmountYocto")).toHaveTextContent(
        "2000000000000000000000000"
      );
      expect(screen.getByTestId("selectedTokenId")).toHaveTextContent(
        "linear-protocol.testnet"
      );
    });

    it("should calculate transferAmountYocto for NEAR tokens during onboarding", async () => {
      mockUseNearBalance.mockReturnValue({
        nearBalance: "10000000000000000000000000",
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
        screen.getByTestId("setAmountFourNEAR").click(); // 4 NEAR
      });

      // Transfer amount is 4 NEAR - registration cost = 4 NEAR - 3 NEAR = 1 NEAR
      expect(screen.getByTestId("transferAmountYocto")).toHaveTextContent(
        "1000000000000000000000000"
      );
      expect(screen.getByTestId("selectedTokenId")).toHaveTextContent(
        "test-account.testnet"
      );
    });

    it("should calculate transferAmountYocto for NEAR tokens post-onboarding", async () => {
      mockUseNearBalance.mockReturnValue({
        nearBalance: "10000000000000000000000000",
        isLoadingNearBalance: false,
        nearBalanceError: null,
      });

      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmountFourNEAR").click(); // 4 NEAR
      });

      // Transfer amount is 4 NEAR - registration cost = 4 NEAR - 3 NEAR = 1 NEAR
      expect(screen.getByTestId("transferAmountYocto")).toHaveTextContent(
        "4000000000000000000000000"
      );
      expect(screen.getByTestId("selectedTokenId")).toHaveTextContent(
        "test-account.testnet"
      );
    });
  });

  describe("Amount to lock calculations", () => {
    it("should return undefined amount for onboarding (lock all)", async () => {
      const TestGetAmountOnboarding = () => {
        const context = useLockProviderContext();
        const [result, setResult] = React.useState<string | undefined>(
          undefined
        );

        const handleGetAmount = async () => {
          const amount = await context.getAmountToLock();
          setResult(amount);
        };

        return (
          <div>
            <button data-testid="getAmount" onClick={handleGetAmount}>
              Get Amount
            </button>
            {result && <div data-testid="result">{result}</div>}
          </div>
        );
      };

      render(
        <LockProvider source="onboarding">
          <TestGetAmountOnboarding />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("getAmount").click();
      });

      expect(screen.queryByTestId("result")).toBeFalsy();
    });

    it("should calculate amount to lock for LST tokens for onboarded users", async () => {
      mockRefetchAvailableToLock.mockResolvedValue({
        data: "10000000000000000000000000", // 10 NEAR
      });

      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="linear-protocol.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click(); // 2 liNEAR
      });

      // Amount to lock is the minimum of: amount available in lockup contract (10 NEAR) and amount to lock (2 liNEAR = 2.1 NEAR) = 2.1 NEAR
      await waitFor(() => {
        expect(screen.getByTestId("amountToLock")).toHaveTextContent(
          "2100000000000000000000000"
        );
      });
    });

    it("should calculate amount to lock for NEAR tokens for onboarded users", async () => {
      mockRefetchAvailableToLock.mockResolvedValue({
        data: "10000000000000000000000000", // 10 NEAR
      });

      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click(); // 2 NEAR
      });

      // Amount to lock is the minimum of: amount available in lockup contract (10 NEAR) and amount to lock (2 NEAR) = 2 NEAR
      await waitFor(() => {
        expect(screen.getByTestId("amountToLock")).toHaveTextContent(
          "2000000000000000000000000"
        );
      });
    });

    it("should return minimum of target amount and available amount", async () => {
      mockRefetchAvailableToLock.mockResolvedValue({
        data: "500000000000000000000000", // 0.5 NEAR (less than entered amount)
      });

      render(
        <LockProvider
          source="account_management"
          preSelectedTokenId="test-account.testnet"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      await act(async () => {
        screen.getByTestId("setAmount").click(); // 2 liNEAR
      });

      // Should return the smaller available amount
      expect(screen.getByTestId("amountToLock")).toHaveTextContent(
        "500000000000000000000000"
      );
    });
  });

  describe("Edge Cases and Errors", () => {
    it("should return error", () => {
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
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Lockup account error"
      );
    });

    it("should return error from multiple hooks", () => {
      mockUseLockupAccount.mockReturnValue({
        lockupAccountId: undefined,
        isLoading: false,
        error: new Error("Lockup account error"),
      });

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

      expect(screen.getByTestId("error")).toHaveTextContent(
        "Lockup account error"
      );
    });

    it("should handle non-existent preselected token ID", () => {
      render(
        <LockProvider
          source="onboarding"
          preSelectedTokenId="non-existent-token"
        >
          <TestComponent />
        </LockProvider>,
        { wrapper }
      );

      expect(screen.getByTestId("selectedTokenId")).toHaveTextContent(
        "linear-protocol.testnet"
      );
    });

    it("should handle venearAmount calculation with null staking pool price", () => {
      mockUseStakingPool.mockReturnValue({
        stakingPools: {
          stNear: {
            price: null, // This should cause calculation to return "0"
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

      expect(screen.getByTestId("venearAmount")).toHaveTextContent("0");
    });
  });
});
