import type { Contract } from "near-api-js/lib/contract";

/**
 * Represents function kinds in NEAR contracts
 */
export type FunctionKind = "view" | "call";

/**
 * Extract method names from a NEAR ABI by kind
 */
export type ContractMethodNames<
  TAbi extends Record<string, any>,
  TKind extends FunctionKind,
> = TAbi extends { body: { functions: Array<infer TFunction> } }
  ? TFunction extends { name: infer TName; kind: TKind }
    ? TName extends string
      ? TName
      : never
    : never
  : string;

/**
 * Extract parameter types from a NEAR ABI method
 */
export type ContractMethodArgs<
  TAbi extends Record<string, any>,
  TFunctionName extends string,
> = TAbi extends { body: { functions: Array<infer TFunction> } }
  ? TFunction extends {
      name: TFunctionName;
      params?: { args: Array<infer TParam> };
    }
    ? TParam extends { name: string; type_schema: any }
      ? Record<TParam["name"], unknown>
      : Record<string, unknown>
    : Record<string, unknown>
  : Record<string, unknown>;

/**
 * Extract return type from a NEAR ABI method
 */
export type ContractMethodResult<
  TAbi extends Record<string, any>,
  TFunctionName extends string,
> = TAbi extends { body: { functions: Array<infer TFunction> } }
  ? TFunction extends {
      name: TFunctionName;
      result?: { type_schema: infer TResult };
    }
    ? TResult
    : unknown
  : unknown;

/**
 * NEAR transaction status
 */
export type TransactionStatus = "NotStarted" | "Pending" | "Success" | "Error";

/**
 * Configuration for a NEAR contract call
 */
export type NearContractCallConfig = {
  contractId: string;
  methodName: string;
  args?: Record<string, any>;
  gas?: string;
  amount?: string;
  walletMeta?: string;
  walletCallbackUrl?: string;
};

/**
 * Result of a NEAR contract write operation
 * @template TData - The type of data returned by the contract method
 */
export type NearWriteContractResult<TData = any> = {
  status: TransactionStatus;
  transactionHash?: string;
  error?: Error;
  data?: TData;
};
