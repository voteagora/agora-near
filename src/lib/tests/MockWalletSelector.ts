
import { Wallet } from "@near-wallet-selector/core";

export class MockWalletSelector {
  isSignedIn() {
    return true;
  }

  store = {
    getState: () => ({
      accounts: [{ accountId: "mock-user.testnet", active: true }],
    }),
    observable: {
      subscribe: () => ({ unsubscribe: () => {} }),
    },
  };

  wallet(): Promise<Wallet> {
    return Promise.resolve({
      signIn: async () => [],
      signOut: async () => {},
      getAccounts: async () => [{ accountId: "mock-user.testnet", active: true }],
      signAndSendTransaction: async (params: any) => {
        console.log("Mock calling signAndSendTransaction", params);
        return {
          transaction_outcome: { id: "mock-tx-hash" },
          receipts_outcome: [],
        };
      },
      signAndSendTransactions: async (params: any) => {
         console.log("Mock calling signAndSendTransactions", params);
         return [
           {
             transaction_outcome: { id: "mock-tx-hash" },
             receipts_outcome: [],
           }
         ];
      }
    } as unknown as Wallet);
  }
}
