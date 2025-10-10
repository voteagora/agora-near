/**
 * API handler to fetch fungible token balances for a NEAR account
 */
import axios from "axios";

export interface FungibleToken {
  balance: string;
  contract_id: string;
  last_update_block_height: number | null;
}

export interface FungibleTokensResponse {
  account_id: string;
  tokens: FungibleToken[];
}

export async function fetchFungibleTokens(
  accountId: string,
  networkId: "mainnet" = "mainnet"
): Promise<FungibleTokensResponse | null> {
  if (!accountId) return null;

  try {
    const response = await axios.get<FungibleTokensResponse>(
      `https://api.fastnear.com/v1/account/${accountId}/ft`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching fungible token balances:", error);
    return null;
  }
}
