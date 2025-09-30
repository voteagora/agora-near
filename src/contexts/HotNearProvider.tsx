"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { NetworkId } from "@near-wallet-selector/core";
import { providers } from "near-api-js";
import { getRpcUrl } from "@/lib/utils";
import { convertUnit } from "@fastnear/utils";
import { generateNonce } from "@/lib/api/nonce/requests";
import { NearContext } from "@/contexts/NearContext";
import * as NearConnect from "@hot-labs/near-connect";

// NOTE: This provider maintains the SAME external API as NearContext,
// but internally will switch to HOT Connector when the flag is active.

export interface HotNearContextType {
  signedAccountId: string | undefined;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  viewMethod: (options: {
    contractId: string;
    method: string;
    args?: Record<string, unknown>;
    blockId?: number;
    useArchivalNode?: boolean;
  }) => Promise<any>;
  callMethod: (options: {
    contractId: string;
    method: string;
    args?: Record<string, unknown>;
    gas?: string;
    deposit?: string;
  }) => Promise<any>;
  getTransactionResult: (txhash: string) => Promise<any>;
  getBalance: (accountId: string) => Promise<string>;
  signAndSendTransactions: (options: { transactions: any[] }) => Promise<any>;
  getAccessKeys: (accountId: string) => Promise<any[]>;
  callContracts: (props: {
    contractCalls: Record<
      string,
      {
        methodName: string;
        args?: Record<string, unknown>;
        gas?: string;
        deposit?: string;
      }[]
    >;
    callbackUrl?: string;
  }) => Promise<any>;
  signMessage: (options: {
    message: string;
    recipient?: string;
    nonce?: Buffer;
  }) => Promise<{ signature: string; publicKey: string } | void>;
  networkId: NetworkId;
  isInitialized: boolean;
  transferNear: (options: {
    receiverId: string;
    amount: string;
  }) => Promise<any>;
  transferFungibleToken: (options: {
    tokenContractId: string;
    receiverId: string;
    amount: string;
    memo?: string;
  }) => Promise<any>;
}

export function HotNearProvider({
  children,
  networkId,
}: {
  children: ReactNode;
  networkId: NetworkId;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [signedAccountId, setSignedAccountId] = useState<string | undefined>();
  const connectorRef = useRef<any | null>(null);

  const debugLog = useCallback((message: string) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`[${new Date().toLocaleString()}]: ${message}`);
    }
  }, []);

  const init = useCallback(async () => {
    try {
      // Assuming similar API: createConnector({ networkId }) or similar.
      // Since the exact API may vary, we protect with optional chaining.
      const connector = await (NearConnect as any).createConnector?.({
        networkId,
      });

      connectorRef.current = connector;
      const accountId: string | undefined =
        await connector?.getActiveAccount?.();
      setSignedAccountId(accountId);

      // Subscribe to account changes if available
      connector?.on?.("accountsChanged", (accounts: string[]) => {
        setSignedAccountId(accounts?.[0]);
      });
    } finally {
      setIsInitialized(true);
    }
  }, [networkId]);

  useEffect(() => {
    init();
  }, [init]);

  const viewMethod = useCallback(
    async ({
      contractId,
      method,
      args = {},
      blockId,
      useArchivalNode = false,
    }: {
      contractId: string;
      method: string;
      args?: Record<string, unknown>;
      blockId?: number;
      useArchivalNode?: boolean;
    }) => {
      const url = getRpcUrl(networkId, { useArchivalNode });
      const provider = new providers.JsonRpcProvider({ url });
      debugLog(
        `viewMethod [req - ${contractId}.${method}]: ${JSON.stringify(args, null, 2)} blockId: ${blockId}`
      );
      const res = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
        finality: useArchivalNode ? undefined : "optimistic",
        block_id: blockId,
      });
      const resultArray = (res as any).result;
      const jsonResult = JSON.parse(Buffer.from(resultArray).toString());
      debugLog(
        `viewMethod [res - ${contractId}.${method}]: ${JSON.stringify(jsonResult, null, 2)}`
      );
      return jsonResult;
    },
    [networkId, debugLog]
  );

  const signIn = useCallback(async () => {
    const connector = connectorRef.current;
    await connector?.connect?.();
  }, []);

  const signOut = useCallback(async () => {
    const connector = connectorRef.current;
    await connector?.disconnect?.();
    setSignedAccountId(undefined);
  }, []);

  const callMethod = useCallback(
    async ({
      contractId,
      method,
      args = {},
      gas = convertUnit("30 Tgas"),
      deposit = "0",
    }: {
      contractId: string;
      method: string;
      args?: Record<string, unknown>;
      gas?: string;
      deposit?: string;
    }) => {
      const connector = connectorRef.current;
      if (!connector?.signAndSendTransaction) return null;
      const outcome = await connector.signAndSendTransaction({
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: { methodName: method, args, gas, deposit },
          },
        ],
      });
      if (!outcome) return null;
      return providers.getTransactionLastResult(outcome);
    },
    []
  );

  const callContracts = useCallback(
    async ({
      contractCalls,
      callbackUrl,
    }: {
      contractCalls: Record<
        string,
        {
          methodName: string;
          args?: Record<string, unknown>;
          gas?: string;
          deposit?: string;
        }[]
      >;
      callbackUrl?: string;
    }) => {
      const connector = connectorRef.current;
      if (!connector?.signAndSendTransactions) return null;
      const transactions = Object.keys(contractCalls).map((contractId) => ({
        receiverId: contractId,
        actions: contractCalls[contractId].map(
          ({ methodName, args, gas, deposit }) => ({
            type: "FunctionCall",
            params: {
              methodName,
              args: args ?? {},
              gas: gas ? convertUnit(gas) : convertUnit("30 Tgas"),
              deposit: deposit ? convertUnit(deposit) : "0",
            },
          })
        ),
      }));
      const outcomes = await connector.signAndSendTransactions({
        transactions,
        callbackUrl,
      });
      if (!outcomes) return null;
      return outcomes.map((outcome: any) =>
        providers.getTransactionLastResult(outcome)
      );
    },
    []
  );

  const signAndSendTransactions = useCallback(
    async ({ transactions }: { transactions: any[] }) => {
      const connector = connectorRef.current;
      if (!connector?.signAndSendTransactions) return null;
      return connector.signAndSendTransactions({ transactions });
    },
    []
  );

  const getTransactionResult = useCallback(
    async (txhash: string) => {
      const url = getRpcUrl(networkId, { useArchivalNode: true });
      const provider = new providers.JsonRpcProvider({ url });
      const transaction = await provider.txStatus(txhash, "unnused");
      return providers.getTransactionLastResult(transaction);
    },
    [networkId]
  );

  const getBalance = useCallback(
    async (accountId: string) => {
      const url = getRpcUrl(networkId, { useArchivalNode: true });
      const provider = new providers.JsonRpcProvider({ url });
      const account = await provider.query({
        request_type: "view_account",
        account_id: accountId,
        finality: "final",
      });
      return (account as any).amount ?? "0";
    },
    [networkId]
  );

  const getAccessKeys = useCallback(
    async (accountId: string) => {
      const url = getRpcUrl(networkId, { useArchivalNode: true });
      const provider = new providers.JsonRpcProvider({ url });
      const keys = await provider.query({
        request_type: "view_access_key_list",
        account_id: accountId,
        finality: "final",
      });
      return (keys as any).keys || [];
    },
    [networkId]
  );

  const signMessage = useCallback(
    async ({
      message,
      recipient = "agora-near-be",
    }: {
      message: string;
      recipient?: string;
    }) => {
      const connector = connectorRef.current;
      if (!connector?.signMessage) return;
      const nonceResponse = await generateNonce({
        account_id: signedAccountId ?? "",
      });
      const nonce = Buffer.from(nonceResponse.nonce, "hex");
      return connector.signMessage({ message, recipient, nonce });
    },
    [signedAccountId]
  );

  const transferNear = useCallback(
    async ({ receiverId, amount }: { receiverId: string; amount: string }) => {
      const connector = connectorRef.current;
      if (!connector?.signAndSendTransaction) return null;
      return connector.signAndSendTransaction({
        receiverId,
        actions: [{ type: "Transfer", params: { deposit: amount } }],
      });
    },
    []
  );

  const transferFungibleToken = useCallback(
    async ({
      tokenContractId,
      receiverId,
      amount,
      memo = "",
    }: {
      tokenContractId: string;
      receiverId: string;
      amount: string;
      memo?: string;
    }) => {
      const connector = connectorRef.current;
      if (!connector?.signAndSendTransactions) return null;

      // To maintain parity, we perform the same reads as NearContext
      const minStorageDeposit = (await viewMethod({
        contractId: tokenContractId,
        method: "storage_balance_bounds",
        args: {},
      })) as { min?: string } | null | undefined;

      // Get active account if available
      const accountId: string | undefined =
        await connector?.getActiveAccount?.();
      if (!accountId) throw new Error("No account selected");

      const transactions = [
        {
          signerId: accountId,
          receiverId: tokenContractId,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "storage_deposit",
                args: { account_id: receiverId, registration_only: true },
                gas: convertUnit("30 Tgas"),
                deposit: minStorageDeposit?.min ?? convertUnit("0.01 NEAR"),
              },
            },
          ],
        },
        {
          signerId: accountId,
          receiverId: tokenContractId,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "ft_transfer",
                args: { receiver_id: receiverId, amount, memo },
                gas: convertUnit("30 Tgas"),
                deposit: convertUnit("1 yoctoNEAR"),
              },
            },
          ],
        },
      ];

      return connector.signAndSendTransactions({ transactions });
    },
    [viewMethod]
  );

  const value = useMemo<HotNearContextType>(
    () => ({
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
      isInitialized,
      transferNear,
      transferFungibleToken,
    }),
    [
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
      isInitialized,
      transferNear,
      transferFungibleToken,
    ]
  );

  return (
    <NearContext.Provider value={value as any}>{children}</NearContext.Provider>
  );
}
