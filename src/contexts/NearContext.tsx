/* eslint-disable @typescript-eslint/no-explicit-any */
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { getRpcUrl } from "@/lib/utils";
import { convertUnit } from "@fastnear/utils";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import {
  NetworkId,
  setupWalletSelector,
  WalletModuleFactory,
  WalletSelector,
} from "@near-wallet-selector/core";
import { VerifiedOwner } from "@near-wallet-selector/core/src/lib/wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupModal } from "@near-wallet-selector/modal-ui";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { providers } from "near-api-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Default to max Tgas since it gets refunded if not used
const DEFAULT_GAS = convertUnit("30 Tgas");
const DEFAULT_DEPOSIT = "0";

interface ViewMethodProps {
  contractId: string;
  method: string;
  args?: Record<string, unknown>;
  blockId?: number;
  useArchivalNode?: boolean;
}

interface CallMethodProps extends ViewMethodProps {
  gas?: string;
  deposit?: string;
}

export type MethodCall = {
  methodName: string;
  args?: Record<string, unknown>;
  gas?: string;
  deposit?: string;
};

type CallContractsProps = {
  // Map from contractId to method calls on that contract
  contractCalls: Record<string, MethodCall[]>;
  callbackUrl?: string;
};

interface TransactionsProps {
  transactions: any[];
}

interface NearContextType {
  signedAccountId: string | undefined;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  viewMethod: (options: ViewMethodProps) => Promise<any>;
  callMethod: (options: CallMethodProps) => Promise<any>;
  getTransactionResult: (txhash: string) => Promise<any>;
  getBalance: (accountId: string) => Promise<string>;
  signAndSendTransactions: (options: TransactionsProps) => Promise<any>;
  getAccessKeys: (accountId: string) => Promise<any[]>;
  callContracts: (props: CallContractsProps) => Promise<any>;
  signMessage: (message: string) => Promise<VerifiedOwner | void>;
  networkId: NetworkId;
}

export const NearContext = createContext<NearContextType>({
  signedAccountId: undefined,
  signIn: async () => {},
  signOut: async () => {},
  viewMethod: async () => null,
  callMethod: async () => null,
  getTransactionResult: async () => null,
  getBalance: async () => "",
  signAndSendTransactions: async () => null,
  getAccessKeys: async () => [],
  callContracts: async () => null,
  signMessage: async () => {},
  networkId: "mainnet" as NetworkId,
});

export const useNear = () => useContext(NearContext);

interface NearProviderProps {
  children: ReactNode;
  networkId?: NetworkId;
  createAccessKeyFor?: string;
}

const debugLog = (message: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toLocaleString()}]: ${message}`);
  }
};

export const NearProvider: React.FC<NearProviderProps> = ({
  children,
  networkId = "testnet" as NetworkId,
}) => {
  const [selector, setSelector] = useState<WalletSelector | undefined>();
  const [signedAccountId, setSignedAccountId] = useState<string | undefined>();
  const unsubscribeRef = useRef<() => void>();

  /**
   * To be called when the website loads
   * @param {Function} accountChangeHook - a function that is called when the user signs in or out
   * @returns {Promise<string>} - the accountId of the signed-in user
   */
  const init = useCallback(async () => {
    try {
      const selector = await setupWalletSelector({
        network: networkId,
        modules: [
          setupMyNearWallet() as WalletModuleFactory,
          setupLedger() as WalletModuleFactory,
          setupMeteorWallet() as WalletModuleFactory,
          setupBitteWallet() as WalletModuleFactory,
        ],
      });

      const isSignedIn = selector.isSignedIn();
      const accountId = isSignedIn
        ? selector.store.getState().accounts[0]?.accountId
        : undefined;
      setSignedAccountId(accountId);
      setSelector(selector);

      unsubscribeRef.current = selector.store.observable.subscribe(
        async (state) => {
          const signedAccount = state?.accounts.find(
            (account) => account.active
          )?.accountId;
          setSignedAccountId(signedAccount);
        }
      ).unsubscribe;
    } catch (error) {
      console.error("Error initializing wallet selector:", error);
    }
  }, [networkId]);

  /**
   * Displays a modal to login the user
   */
  const signIn = useCallback(async () => {
    if (!selector) return;
    const modal = setupModal(selector, {
      contractId: TESTNET_CONTRACTS.VENEAR_CONTRACT_ID,
    });
    modal.show();
  }, [selector]);

  /**
   * Logout the user
   */
  const signOut = useCallback(async () => {
    if (!selector) return;
    const selectedWallet = await selector.wallet();
    selectedWallet.signOut();
  }, [selector]);

  /**
   * Makes a read-only call to a contract
   * @param {Object} options - the options for the call
   * @param {string} options.contractId - the contract's account id
   * @param {string} options.method - the method to call
   * @param {Object} options.args - the arguments to pass to the method
   * @returns {Promise<any>} - the result of the method call
   */
  const viewMethod = useCallback(
    async ({
      contractId,
      method,
      args = {},
      blockId,
      useArchivalNode = false,
    }: ViewMethodProps) => {
      const url = getRpcUrl(networkId, {
        useArchivalNode,
      });

      const provider = new providers.JsonRpcProvider({ url });

      debugLog(
        `viewMethod [req - ${contractId}.${method}]: ${JSON.stringify(args, null, 2)} blockId: ${blockId}`
      );

      try {
        const res = await provider.query({
          request_type: "call_function",
          account_id: contractId,
          method_name: method,
          args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
          finality: "optimistic",
          block_id: blockId,
        });

        const resultArray = (res as any).result;
        const jsonResult = JSON.parse(Buffer.from(resultArray).toString());

        debugLog(
          `viewMethod [res - ${contractId}.${method}]: ${JSON.stringify(jsonResult, null, 2)}`
        );

        return jsonResult;
      } catch (error) {
        debugLog(`Error calling ${contractId}.${method}: ${error}`);
        throw error;
      }
    },
    [networkId]
  );

  /**
   * Makes a call to a contract
   * @param {Object} options - the options for the call
   * @param {string} options.contractId - the contract's account id
   * @param {string} options.method - the method to call
   * @param {Object} options.args - the arguments to pass to the method
   * @param {string} options.gas - the amount of gas to use
   * @param {string} options.deposit - the amount of yoctoNEAR to deposit
   * @returns {Promise<any>} - the resulting transaction
   */
  const callMethod = useCallback(
    async ({
      contractId,
      method,
      args = {},
      gas = DEFAULT_GAS,
      deposit = DEFAULT_DEPOSIT,
    }: CallMethodProps) => {
      if (!selector) return null;
      // Sign a transaction with the "FunctionCall" action
      const selectedWallet = await selector.wallet();
      const outcome = await selectedWallet.signAndSendTransaction({
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: method,
              args,
              gas,
              deposit,
            },
          },
        ],
      });

      if (!outcome) return null;
      return providers.getTransactionLastResult(outcome);
    },
    [selector]
  );

  const callContracts = useCallback(
    async ({ contractCalls, callbackUrl }: CallContractsProps) => {
      try {
        if (!selector) return null;

        const selectedWallet = await selector.wallet();

        debugLog(
          `[Contract Calls req]: ${JSON.stringify(contractCalls, null, 2)}`
        );

        const outcomes = await selectedWallet.signAndSendTransactions({
          transactions: Object.keys(contractCalls).map((contractId) => {
            return {
              receiverId: contractId,
              // Putting all the transactions for a given contract into the actions prop means it will
              // rollback if one of the transactions fail.
              actions: contractCalls[contractId].map(
                ({ methodName, args, gas, deposit }) => ({
                  type: "FunctionCall",
                  params: {
                    methodName,
                    args: args ?? {},
                    gas: gas ? convertUnit(gas) : DEFAULT_GAS,
                    deposit: deposit ? convertUnit(deposit) : DEFAULT_DEPOSIT,
                  },
                })
              ),
            };
          }),
          callbackUrl,
        });

        if (!outcomes) return null;

        const results = outcomes.map((outcome) =>
          providers.getTransactionLastResult(outcome)
        );

        debugLog(`[Contract Calls res]: ${JSON.stringify(results, null, 2)}`);

        return results;
      } catch (e) {
        console.error("Error calling methods:", e);
        throw e;
      }
    },
    [selector]
  );

  /**
   * Makes a call to a contract
   * @param {string} txhash - the transaction hash
   * @returns {Promise<any>} - the result of the transaction
   */
  const getTransactionResult = useCallback(
    async (txhash: string) => {
      if (!selector) return null;
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

      // Retrieve transaction result from the network
      const transaction = await provider.txStatus(txhash, "unnused");
      return providers.getTransactionLastResult(transaction);
    },
    [selector]
  );

  /**
   * Gets the balance of an account
   * @param {string} accountId - the account id to get the balance of
   * @returns {Promise<number>} - the balance of the account
   *
   */
  const getBalance = useCallback(
    async (accountId: string) => {
      if (!selector) return "";
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

      // Retrieve account state from the network
      const account = await provider.query({
        request_type: "view_account",
        account_id: accountId,
        finality: "final",
      });
      // return amount on NEAR
      const accountAmount = (account as any).amount;
      return accountAmount ?? "0";
    },
    [selector]
  );

  /**
   * Signs and sends transactions
   * @param {Object[]} transactions - the transactions to sign and send
   * @returns {Promise<any>} - the resulting transactions
   *
   */
  const signAndSendTransactions = useCallback(
    async ({ transactions }: TransactionsProps) => {
      if (!selector) return null;
      const selectedWallet = await selector.wallet();
      return selectedWallet.signAndSendTransactions({ transactions });
    },
    [selector]
  );

  /**
   * Gets the access keys for an account
   * @param {string} accountId
   * @returns {Promise<Object[]>} - the access keys for the account
   */
  const getAccessKeys = useCallback(
    async (accountId: string) => {
      if (!selector) return [];
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

      // Retrieve account state from the network
      const keys = await provider.query({
        request_type: "view_access_key_list",
        account_id: accountId,
        finality: "final",
      });
      return (keys as any).keys || [];
    },
    [selector]
  );

  const signMessage = useCallback(
    async (message: string) => {
      if (!selector) return;
      const selectedWallet = await selector.wallet();
      return selectedWallet.signMessage({
        message,
        recipient: "agora-near-be",
        nonce: Buffer.from(Array.from(Array(32).keys())),
      });
    },
    [selector]
  );

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    return () => unsubscribeRef.current?.();
  }, []);

  return (
    <NearContext.Provider
      value={{
        signedAccountId,
        signIn,
        signOut,
        viewMethod,
        callMethod,
        getTransactionResult,
        getBalance,
        signAndSendTransactions,
        getAccessKeys,
        callContracts,
        signMessage,
        networkId,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};
