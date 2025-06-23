import { useNear } from "@/contexts/NearContext";
import { useQuery } from "@tanstack/react-query";

export const STAKED_BALANCE_QK = "stakedBalance";

export const useStakedBalance = ({
  stakingPoolId,
  accountId,
}: {
  stakingPoolId?: string | null;
  accountId?: string | null;
}) => {
  const { viewMethod } = useNear();

  const { data, isLoading } = useQuery({
    queryKey: [STAKED_BALANCE_QK, stakingPoolId],
    queryFn: () => {
      return viewMethod({
        contractId: stakingPoolId ?? "",
        method: "get_account_staked_balance",
        args: {
          account_id: accountId,
        },
      }) as Promise<string | null | undefined>;
    },
    enabled: !!stakingPoolId && !!accountId,
  });

  return {
    stakedBalance: data,
    isLoading,
  };
};
