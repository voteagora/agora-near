import { useNear } from "@/contexts/NearContext";
import {
  LINEAR_TOKEN_CONTRACTS,
  LINEAR_TOKEN_METADATA,
  NEAR_TOKEN_METADATA,
  STNEAR_TOKEN_CONTRACTS,
  STNEAR_TOKEN_METADATA,
} from "@/lib/constants";
import { TokenWithBalance } from "@/lib/types";
import Big from "big.js";
import { useMemo } from "react";
import { useAvailableToLock } from "./useAvailableToLock";
import { useFungibleTokens } from "./useFungibleTokens";
import { useLockupAccount } from "./useLockupAccount";
import { useNearBalance } from "./useNearBalance";

export const useAvailableTokens = () => {
  const { signedAccountId, networkId } = useNear();
  const { data: fungibleTokensResponse, isLoading: isLoadingFungibleTokens } =
    useFungibleTokens(signedAccountId);
  const { nearBalance, isLoadingNearBalance } = useNearBalance(signedAccountId);

  const { lockupAccountId, isLoading: isLoadingLockupAccountId } =
    useLockupAccount();

  const { availableToLock: availableToLockInLockup, isLoadingAvailableToLock } =
    useAvailableToLock({ lockupAccountId: signedAccountId });

  const linearTokenContractId = useMemo(
    () => LINEAR_TOKEN_CONTRACTS[networkId],
    [networkId]
  );

  const stNearTokenContractId = useMemo(
    () => STNEAR_TOKEN_CONTRACTS[networkId],
    [networkId]
  );

  const isLoading =
    isLoadingFungibleTokens ||
    isLoadingNearBalance ||
    isLoadingAvailableToLock ||
    isLoadingLockupAccountId;

  const availableTokens = useMemo(() => {
    const tokens: TokenWithBalance[] = [];

    if (availableToLockInLockup && Big(availableToLockInLockup).gt(0)) {
      tokens.push({
        type: "lockup" as const,
        metadata: NEAR_TOKEN_METADATA,
        accountId: lockupAccountId,
        balance: availableToLockInLockup,
      });
    }

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

            return null;
          })
          .filter((token) => token !== null)
      );
    }

    return tokens.sort((a, b) => (Big(b.balance).gt(a.balance) ? 1 : -1));
  }, [
    availableToLockInLockup,
    fungibleTokensResponse,
    linearTokenContractId,
    lockupAccountId,
    nearBalance,
    signedAccountId,
    stNearTokenContractId,
  ]);

  return { isLoading, availableTokens };
};
