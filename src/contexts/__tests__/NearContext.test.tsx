import { NetworkId } from "@near-wallet-selector/core";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockedFunction,
  vi,
} from "vitest";
import { NearProvider, useNear } from "../NearContext";

import { getRpcUrl } from "@/lib/utils";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { providers } from "near-api-js";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";

// Mock all the dependencies
vi.mock("@near-wallet-selector/core");
vi.mock("@near-wallet-selector/modal-ui");
vi.mock("@near-wallet-selector/my-near-wallet");
vi.mock("@near-wallet-selector/ledger");
vi.mock("@near-wallet-selector/meteor-wallet");
vi.mock("@near-wallet-selector/bitte-wallet");
vi.mock("near-api-js");
vi.mock("@/lib/contractConstants");
vi.mock("@/lib/utils");

// Mock implementations
const mockWalletSelector = {
  isSignedIn: vi.fn(),
  store: {
    getState: vi.fn(),
    observable: {
      subscribe: vi.fn(),
    },
  },
  options: {
    network: {
      networkId: "testnet" as NetworkId,
    },
  },
  wallet: vi.fn(),
};

const mockWallet = {
  signOut: vi.fn(),
  signAndSendTransaction: vi.fn(),
  signAndSendTransactions: vi.fn(),
  signMessage: vi.fn(),
};

const mockModal = {
  show: vi.fn(),
};

const mockProvider = {
  query: vi.fn(),
  txStatus: vi.fn(),
};

const mockSetupWalletSelector = setupWalletSelector as MockedFunction<
  typeof setupWalletSelector
>;
const mockSetupModal = setupModal as MockedFunction<typeof setupModal>;
const mockSetupMyNearWallet = setupMyNearWallet as MockedFunction<
  typeof setupMyNearWallet
>;
const mockSetupLedger = setupLedger as MockedFunction<typeof setupLedger>;
const mockSetupMeteorWallet = setupMeteorWallet as MockedFunction<
  typeof setupMeteorWallet
>;
const mockSetupBitteWallet = setupBitteWallet as MockedFunction<
  typeof setupBitteWallet
>;

const mockGetRpcUrl = getRpcUrl as MockedFunction<typeof getRpcUrl>;
const mockGetTransactionLastResult =
  providers.getTransactionLastResult as MockedFunction<
    typeof providers.getTransactionLastResult
  >;

// Test wrapper component
const TestWrapper = ({
  children,
  networkId = "testnet",
}: {
  children: ReactNode;
  networkId?: NetworkId;
}) => <NearProvider networkId={networkId}>{children}</NearProvider>;

describe("NearContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    mockSetupWalletSelector.mockResolvedValue(mockWalletSelector as any);
    mockSetupModal.mockReturnValue(mockModal as any);
    mockSetupMyNearWallet.mockReturnValue({} as any);
    mockSetupLedger.mockReturnValue({} as any);
    mockSetupMeteorWallet.mockReturnValue({} as any);
    mockSetupBitteWallet.mockReturnValue({} as any);
    mockGetRpcUrl.mockReturnValue("https://rpc.testnet.near.org");
    mockGetTransactionLastResult.mockReturnValue("mock-result");

    mockWalletSelector.isSignedIn.mockReturnValue(false);
    mockWalletSelector.store.getState.mockReturnValue({ accounts: [] });
    mockWalletSelector.store.observable.subscribe.mockReturnValue({
      unsubscribe: vi.fn(),
    });
    mockWalletSelector.wallet.mockResolvedValue(mockWallet);

    (providers.JsonRpcProvider as any) = vi
      .fn()
      .mockImplementation(() => mockProvider);

    // Mock console methods to avoid noise in tests
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("useNear hook", () => {
    it("should return the context values with default state", async () => {
      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.signedAccountId).toBeUndefined();
      expect(result.current.networkId).toBe("testnet");
    });

    it("should initialize with signed-in user when wallet is already connected", async () => {
      const mockAccountId = "test-account.testnet";
      mockWalletSelector.isSignedIn.mockReturnValue(true);
      mockWalletSelector.store.getState.mockReturnValue({
        accounts: [{ accountId: mockAccountId, active: true }],
      });

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.signedAccountId).toBe(mockAccountId);
    });

    it("should handle wallet selector initialization error", async () => {
      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.signedAccountId).toBeUndefined();
    });
  });

  describe("signIn method", () => {
    it("should show modal when signIn is called", async () => {
      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.signIn();
      });

      expect(mockSetupModal).toHaveBeenCalledWith(mockWalletSelector, {
        contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
      });
      expect(mockModal.show).toHaveBeenCalled();
    });

    it("should handle signIn when selector is not initialized", async () => {
      mockSetupWalletSelector.mockResolvedValue(undefined as any);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.signIn();
      });

      expect(mockSetupModal).not.toHaveBeenCalled();
      expect(mockModal.show).not.toHaveBeenCalled();
    });
  });

  describe("signOut method", () => {
    it("should sign out the current wallet", async () => {
      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockWalletSelector.wallet).toHaveBeenCalled();
      expect(mockWallet.signOut).toHaveBeenCalled();
    });

    it("should handle signOut when selector is not initialized", async () => {
      mockSetupWalletSelector.mockResolvedValue(undefined as any);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockWallet.signOut).not.toHaveBeenCalled();
    });
  });

  describe("viewMethod", () => {
    it("should call view method with correct parameters", async () => {
      const mockResult = { value: "test-result" };
      mockProvider.query.mockResolvedValue({
        result: Buffer.from(JSON.stringify(mockResult)),
      });

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const viewResult = await act(async () => {
        return result.current.viewMethod({
          contractId: "test-contract.testnet",
          method: "test_method",
          args: { param1: "value1" },
        });
      });

      expect(mockProvider.query).toHaveBeenCalledWith({
        request_type: "call_function",
        account_id: "test-contract.testnet",
        method_name: "test_method",
        args_base64: Buffer.from(JSON.stringify({ param1: "value1" })).toString(
          "base64"
        ),
        finality: "optimistic",
        block_id: undefined,
      });
      expect(viewResult).toEqual(mockResult);
    });

    it("should handle view method with archival node", async () => {
      const mockResult = { value: "test-result" };
      mockProvider.query.mockResolvedValue({
        result: Buffer.from(JSON.stringify(mockResult)),
      });

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.viewMethod({
          contractId: "test-contract.testnet",
          method: "test_method",
          args: { param1: "value1" },
          useArchivalNode: true,
          blockId: 12345,
        });
      });

      expect(mockGetRpcUrl).toHaveBeenCalledWith("testnet", {
        useArchivalNode: true,
      });
      expect(mockProvider.query).toHaveBeenCalledWith({
        request_type: "call_function",
        account_id: "test-contract.testnet",
        method_name: "test_method",
        args_base64: Buffer.from(JSON.stringify({ param1: "value1" })).toString(
          "base64"
        ),
        finality: undefined,
        block_id: 12345,
      });
    });

    it("should handle view method error", async () => {
      const error = new Error("View method error");
      mockProvider.query.mockRejectedValue(error);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await expect(
        act(async () => {
          await result.current.viewMethod({
            contractId: "test-contract.testnet",
            method: "test_method",
          });
        })
      ).rejects.toThrow("View method error");
    });
  });

  describe("callMethod", () => {
    it("should call method with correct parameters", async () => {
      const mockOutcome = { transaction: { hash: "test-hash" } };
      mockWallet.signAndSendTransaction.mockResolvedValue(mockOutcome);
      mockGetTransactionLastResult.mockReturnValue("test-result");

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const callResult = await act(async () => {
        return result.current.callMethod({
          contractId: "test-contract.testnet",
          method: "test_method",
          args: { param1: "value1" },
          gas: "30000000000000",
          deposit: "1000000000000000000000000",
        });
      });

      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith({
        receiverId: "test-contract.testnet",
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "test_method",
              args: { param1: "value1" },
              gas: "30000000000000",
              deposit: "1000000000000000000000000",
            },
          },
        ],
      });
      expect(callResult).toBe("test-result");
    });

    it("should use default gas and deposit when not provided", async () => {
      const mockOutcome = { transaction: { hash: "test-hash" } };
      mockWallet.signAndSendTransaction.mockResolvedValue(mockOutcome);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.callMethod({
          contractId: "test-contract.testnet",
          method: "test_method",
        });
      });

      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith({
        receiverId: "test-contract.testnet",
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "test_method",
              args: {},
              gas: "30000000000000",
              deposit: "0",
            },
          },
        ],
      });
    });

    it("should return null when selector is not initialized", async () => {
      mockSetupWalletSelector.mockResolvedValue(undefined as any);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const callResult = await act(async () => {
        return result.current.callMethod({
          contractId: "test-contract.testnet",
          method: "test_method",
        });
      });

      expect(callResult).toBeNull();
    });
  });

  describe("getTransactionResult", () => {
    it("should get transaction result", async () => {
      const mockTransaction = { transaction: { hash: "test-hash" } };
      mockProvider.txStatus.mockResolvedValue(mockTransaction);
      mockGetTransactionLastResult.mockReturnValue("test-result");

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const transactionResult = await act(async () => {
        return result.current.getTransactionResult("test-hash");
      });

      expect(mockGetRpcUrl).toHaveBeenCalledWith("testnet", {
        useArchivalNode: true,
      });
      expect(mockProvider.txStatus).toHaveBeenCalledWith(
        "test-hash",
        "unnused"
      );
      expect(transactionResult).toBe("test-result");
    });

    it("should return null when selector is not initialized", async () => {
      mockSetupWalletSelector.mockResolvedValue(undefined as any);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const transactionResult = await act(async () => {
        return result.current.getTransactionResult("test-hash");
      });

      expect(transactionResult).toBeNull();
    });
  });

  describe("getBalance", () => {
    it("should get account balance", async () => {
      const mockAccount = { amount: "1000000000000000000000000" };
      mockProvider.query.mockResolvedValue(mockAccount);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const balance = await act(async () => {
        return result.current.getBalance("test-account.testnet");
      });

      expect(mockProvider.query).toHaveBeenCalledWith({
        request_type: "view_account",
        account_id: "test-account.testnet",
        finality: "final",
      });
      expect(balance).toBe("1000000000000000000000000");
    });

    it("should return default balance when account has no amount", async () => {
      mockProvider.query.mockResolvedValue({});

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const balance = await act(async () => {
        return result.current.getBalance("test-account.testnet");
      });

      expect(balance).toBe("0");
    });
  });

  describe("getAccessKeys", () => {
    it("should get access keys for account", async () => {
      const mockKeys = { keys: [{ public_key: "ed25519:test-key" }] };
      mockProvider.query.mockResolvedValue(mockKeys);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const accessKeys = await act(async () => {
        return result.current.getAccessKeys("test-account.testnet");
      });

      expect(mockProvider.query).toHaveBeenCalledWith({
        request_type: "view_access_key_list",
        account_id: "test-account.testnet",
        finality: "final",
      });
      expect(accessKeys).toEqual([{ public_key: "ed25519:test-key" }]);
    });

    it("should return empty array when no keys", async () => {
      mockProvider.query.mockResolvedValue({});

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const accessKeys = await act(async () => {
        return result.current.getAccessKeys("test-account.testnet");
      });

      expect(accessKeys).toEqual([]);
    });
  });

  describe("callContracts", () => {
    it("should call multiple contracts", async () => {
      const mockOutcomes = [
        { transaction: { hash: "hash1" } },
        { transaction: { hash: "hash2" } },
      ];
      mockWallet.signAndSendTransactions.mockResolvedValue(mockOutcomes);
      mockGetTransactionLastResult
        .mockReturnValueOnce("result1")
        .mockReturnValueOnce("result2");

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const contractCalls = {
        "contract1.testnet": [
          { methodName: "method1", args: { param: "value1" } },
        ],
        "contract2.testnet": [
          { methodName: "method2", args: { param: "value2" } },
        ],
      };

      const results = await act(async () => {
        return result.current.callContracts({ contractCalls });
      });

      expect(mockWallet.signAndSendTransactions).toHaveBeenCalledWith({
        transactions: [
          {
            receiverId: "contract1.testnet",
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "method1",
                  args: { param: "value1" },
                  gas: "30000000000000",
                  deposit: "0",
                },
              },
            ],
          },
          {
            receiverId: "contract2.testnet",
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "method2",
                  args: { param: "value2" },
                  gas: "30000000000000",
                  deposit: "0",
                },
              },
            ],
          },
        ],
        callbackUrl: undefined,
      });
      expect(results).toEqual(["result1", "result2"]);
    });

    it("should handle callContracts error", async () => {
      const error = new Error("Contract call error");
      mockWallet.signAndSendTransactions.mockRejectedValue(error);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await expect(
        act(async () => {
          await result.current.callContracts({
            contractCalls: { "contract.testnet": [{ methodName: "method" }] },
          });
        })
      ).rejects.toThrow("Contract call error");
    });
  });

  describe("signMessage", () => {
    it("should sign message with default parameters", async () => {
      const mockSignedMessage = { signature: "test-signature" };
      mockWallet.signMessage.mockResolvedValue(mockSignedMessage);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const signedMessage = await act(async () => {
        return result.current.signMessage({ message: "test-message" });
      });

      expect(mockWallet.signMessage).toHaveBeenCalledWith({
        message: "test-message",
        recipient: "agora-near-be",
        nonce: expect.any(Buffer),
      });
      expect(signedMessage).toBe(mockSignedMessage);
    });

    it("should sign message with custom parameters", async () => {
      const mockSignedMessage = { signature: "test-signature" };
      mockWallet.signMessage.mockResolvedValue(mockSignedMessage);
      const customNonce = Buffer.from("custom-nonce");

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.signMessage({
          message: "test-message",
          recipient: "custom-recipient",
          nonce: customNonce,
        });
      });

      expect(mockWallet.signMessage).toHaveBeenCalledWith({
        message: "test-message",
        recipient: "custom-recipient",
        nonce: customNonce,
      });
    });
  });

  describe("transferNear", () => {
    it("should transfer NEAR tokens", async () => {
      const mockOutcome = { transaction: { hash: "test-hash" } };
      mockWallet.signAndSendTransaction.mockResolvedValue(mockOutcome);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const transferResult = await act(async () => {
        return result.current.transferNear({
          receiverId: "recipient.testnet",
          amount: "1000000000000000000000000",
        });
      });

      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith({
        receiverId: "recipient.testnet",
        actions: [
          {
            type: "Transfer",
            params: {
              deposit: "1000000000000000000000000",
            },
          },
        ],
      });
      expect(transferResult).toBe(mockOutcome);
    });
  });

  describe("transferFungibleToken", () => {
    it("should transfer fungible tokens with storage deposit", async () => {
      const mockOutcome = { transaction: { hash: "test-hash" } };
      mockWallet.signAndSendTransactions.mockResolvedValue(mockOutcome);
      mockWalletSelector.store.getState.mockReturnValue({
        accounts: [{ accountId: "sender.testnet" }],
      });

      // Mock storage balance bounds
      const mockStorageBalanceBounds = { min: "1250000000000000000000" };
      mockProvider.query.mockResolvedValue({
        result: Buffer.from(JSON.stringify(mockStorageBalanceBounds)),
      });

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const transferResult = await act(async () => {
        return result.current.transferFungibleToken({
          tokenContractId: "token.testnet",
          receiverId: "recipient.testnet",
          amount: "1000000000000000000000000",
          memo: "test transfer",
        });
      });

      expect(mockWallet.signAndSendTransactions).toHaveBeenCalledWith({
        transactions: [
          {
            signerId: "sender.testnet",
            receiverId: "token.testnet",
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "storage_deposit",
                  args: {
                    account_id: "recipient.testnet",
                    registration_only: true,
                  },
                  gas: "30000000000000",
                  deposit: "1250000000000000000000",
                },
              },
            ],
          },
          {
            signerId: "sender.testnet",
            receiverId: "token.testnet",
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "ft_transfer",
                  args: {
                    receiver_id: "recipient.testnet",
                    amount: "1000000000000000000000000",
                    memo: "test transfer",
                  },
                  gas: "30000000000000",
                  deposit: "1",
                },
              },
            ],
          },
        ],
      });
      expect(transferResult).toBe(mockOutcome);
    });

    it("should throw error when no account selected", async () => {
      mockWalletSelector.store.getState.mockReturnValue({ accounts: [] });

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await expect(
        act(async () => {
          await result.current.transferFungibleToken({
            tokenContractId: "token.testnet",
            receiverId: "recipient.testnet",
            amount: "1000000000000000000000000",
          });
        })
      ).rejects.toThrow("No account selected");
    });
  });

  describe("signAndSendTransactions", () => {
    it("should sign and send transactions", async () => {
      const mockOutcome = { transaction: { hash: "test-hash" } };
      mockWallet.signAndSendTransactions.mockResolvedValue(mockOutcome);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const transactions = [
        {
          receiverId: "contract.testnet",
          actions: [{ type: "FunctionCall", params: {} }],
        },
      ];

      const transactionResult = await act(async () => {
        return result.current.signAndSendTransactions({ transactions });
      });

      expect(mockWallet.signAndSendTransactions).toHaveBeenCalledWith({
        transactions,
      });
      expect(transactionResult).toBe(mockOutcome);
    });

    it("should return null when selector is not initialized", async () => {
      mockSetupWalletSelector.mockResolvedValue(undefined as any);

      const { result } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const transactionResult = await act(async () => {
        return result.current.signAndSendTransactions({ transactions: [] });
      });

      expect(transactionResult).toBeNull();
    });
  });

  describe("context with different network", () => {
    it("should initialize with mainnet network", async () => {
      const MainnetWrapper = ({ children }: { children: ReactNode }) => (
        <NearProvider networkId="mainnet">{children}</NearProvider>
      );

      const { result } = renderHook(() => useNear(), {
        wrapper: MainnetWrapper,
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.networkId).toBe("mainnet");
    });
  });

  describe("cleanup", () => {
    it("should cleanup subscription on unmount", async () => {
      const unsubscribeMock = vi.fn();
      mockWalletSelector.store.observable.subscribe.mockReturnValue({
        unsubscribe: unsubscribeMock,
      });

      const { unmount } = renderHook(() => useNear(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(
          mockWalletSelector.store.observable.subscribe
        ).toHaveBeenCalled();
      });

      unmount();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });
});
