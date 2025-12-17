import { useQuery } from "@tanstack/react-query";
import { useNear } from "@/contexts/NearContext";

export const UNSTAKED_BALANCE_QK = "unstakedBalance";

export const useUnstakedBalance = ({
  stakingPoolId,
  accountId,
}: {
  stakingPoolId?: string | null;
  accountId?: string | null;
}) => {
  const { viewMethod } = useNear();

  const { data: unstakedBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: [UNSTAKED_BALANCE_QK, stakingPoolId, accountId],
    queryFn: () => {
      return viewMethod({
        contractId: stakingPoolId ?? "",
        method: "get_account_unstaked_balance",
        args: {
          account_id: accountId,
        },
      }) as Promise<string | null | undefined>;
    },
    enabled: !!stakingPoolId && !!accountId,
  });

  const { data: isAvailable, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ["isUnstakedBalanceAvailable", stakingPoolId, accountId],
    queryFn: () => {
      return viewMethod({
        contractId: stakingPoolId ?? "",
        method: "is_account_unstaked_balance_available",
        args: {
          account_id: accountId,
        },
      }) as Promise<boolean>;
    },
    enabled:
      !!stakingPoolId &&
      !!accountId &&
      !!unstakedBalance &&
      unstakedBalance !== "0",
  });

  return {
    unstakedBalance,
    isAvailable: !!isAvailable,
    isLoading: isLoadingBalance || isLoadingAvailability,
  };
};
