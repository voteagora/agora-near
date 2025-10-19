import { useNear } from "@/contexts/NearContext";
import {
  LINEAR_TOKEN_CONTRACT,
  LINEAR_TOKEN_METADATA,
  NEAR_TOKEN_METADATA,
  RNEAR_TOKEN_CONTRACT,
  RNEAR_TOKEN_METADATA,
  STNEAR_TOKEN_CONTRACT,
  STNEAR_TOKEN_METADATA,
} from "@/lib/constants";
import { TokenWithBalance } from "@/lib/types";
import Big from "big.js";
import { useMemo } from "react";
import { useBalance } from "./useBalance";
import { useFungibleTokens } from "./useFungibleTokens";

export const useLiquidWalletTokens = () => {
  const { signedAccountId } = useNear();
  const { data: fungibleTokensResponse, isLoading: isLoadingFungibleTokens } =
    useFungibleTokens(signedAccountId);
  const { nearBalance, isLoadingNearBalance } = useBalance(signedAccountId);

  const linearTokenContractId = useMemo(() => LINEAR_TOKEN_CONTRACT, []);

  const stNearTokenContractId = useMemo(() => STNEAR_TOKEN_CONTRACT, []);

  const rNearTokenContractId = RNEAR_TOKEN_CONTRACT;

  const isLoading = isLoadingFungibleTokens || isLoadingNearBalance;

  const availableTokens = useMemo(() => {
    const tokens: TokenWithBalance[] = [];

    if (nearBalance && Big(nearBalance).gt(0)) {
      tokens.push({
        type: "near",
        metadata: NEAR_TOKEN_METADATA,
        balance: nearBalance,
        accountId: signedAccountId,
      });
    }

    if (fungibleTokensResponse) {
      tokens.push(
        ...fungibleTokensResponse.tokens
          .filter((token) => token && token.balance && Big(token.balance).gt(0))
          .map((token) => {
            if (token.contract_id === linearTokenContractId) {
              return {
                type: "lst" as const,
                accountId: linearTokenContractId,
                metadata: LINEAR_TOKEN_METADATA,
                balance: token.balance,
              };
            }

            if (token.contract_id === stNearTokenContractId) {
              return {
                type: "lst" as const,
                accountId: stNearTokenContractId,
                metadata: STNEAR_TOKEN_METADATA,
                balance: token.balance,
              };
            }

            if (
              rNearTokenContractId &&
              token.contract_id === rNearTokenContractId
            ) {
              return {
                type: "lst" as const,
                accountId: rNearTokenContractId,
                metadata: RNEAR_TOKEN_METADATA,
                balance: token.balance,
              };
            }

            return null;
          })
          .filter((token) => token !== null)
      );
    }

    return tokens.sort((a, b) => (Big(b.balance).gt(a.balance) ? 1 : -1));
  }, [
    fungibleTokensResponse,
    linearTokenContractId,
    nearBalance,
    signedAccountId,
    stNearTokenContractId,
    rNearTokenContractId,
  ]);

  return { isLoading, availableTokens };
};
