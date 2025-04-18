import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";

// near api js
import { providers, utils } from "near-api-js";

// wallet selector
import "@near-wallet-selector/modal-ui/styles.css";
import { setupModal } from "@near-wallet-selector/modal-ui";
import {
  setupWalletSelector,
  WalletSelector,
  NetworkId,
  WalletModuleFactory,
  Subscription,
  Wallet,
} from "@near-wallet-selector/core";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";

const THIRTY_TGAS = "30000000000000";
const NO_DEPOSIT = "0";

interface ViewMethodProps {
  contractId: string;
  method: string;
  args?: Record<string, unknown>;
}

interface CallMethodProps extends ViewMethodProps {
  gas?: string;
  deposit?: string;
}

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
  getBalance: (accountId: string) => Promise<number>;
  signAndSendTransactions: (options: TransactionsProps) => Promise<any>;
  getAccessKeys: (accountId: string) => Promise<any[]>;
}

export const NearContext = createContext<NearContextType>({
  signedAccountId: undefined,
  signIn: async () => {},
  signOut: async () => {},
  viewMethod: async () => null,
  callMethod: async () => null,
  getTransactionResult: async () => null,
  getBalance: async () => 0,
  signAndSendTransactions: async () => null,
  getAccessKeys: async () => [],
});

export const useNear = () => useContext(NearContext);

interface NearProviderProps {
  children: ReactNode;
  networkId?: NetworkId;
  createAccessKeyFor?: string;
}

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
      contractId: "guest-book.testnet",
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
    async ({ contractId, method, args = {} }: ViewMethodProps) => {
      const url = `https://rpc.${networkId}.near.org`;
      const provider = new providers.JsonRpcProvider({ url });

      const res = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
        finality: "optimistic",
      });

      const resultArray = (res as any).result;
      return JSON.parse(Buffer.from(resultArray).toString());
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
      gas = THIRTY_TGAS,
      deposit = NO_DEPOSIT,
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
      if (!selector) return 0;
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
      return accountAmount
        ? Number(utils.format.formatNearAmount(accountAmount))
        : 0;
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
      }}
    >
      {children}
    </NearContext.Provider>
  );
};
