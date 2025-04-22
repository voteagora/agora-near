import { useCallback, useState } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/near/constants";
import { useQueryClient } from "@tanstack/react-query";
import { READ_NEAR_CONTRACT_QK } from "./useReadNearContract";

type Props = {
  lockupAccountId: string;
};

export const useStakeNear = ({ lockupAccountId }: Props) => {
  const [isStakingNear, setIsStakingNear] = useState(false);
  const [stakingNearError, setStakingNearError] = useState<Error | null>(null);
  const { mutateAsync: mutateStakeNear } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const queryClient = useQueryClient();

  const stakeNear = useCallback(
    async (amount: string, stakingPoolId?: string | null) => {
      try {
        setIsStakingNear(true);
        setStakingNearError(null);

        // TODO: This approach will not work for MyNearWallet since it navigates away from the page and doesn't complete the depost_and_stake part of the txn
        // TODO: We should be able to batch these two calls together, but currently selecting a staking pool is async so calling deposit_and_stake in the same batch results in an error
        if (!stakingPoolId) {
          await mutateStakeNear({
            contractId: lockupAccountId,
            methodCalls: [
              {
                methodName: "select_staking_pool",
                args: {
                  staking_pool_account_id: TESTNET_CONTRACTS.STAKING_POOL_ID,
                },
              },
            ],
          });
        }

        queryClient.invalidateQueries({
          queryKey: [
            READ_NEAR_CONTRACT_QK,
            lockupAccountId,
            "get_staking_pool_account_id",
          ],
        });

        await mutateStakeNear({
          contractId: lockupAccountId,
          methodCalls: [
            {
              methodName: "deposit_and_stake",
              args: { amount },
            },
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
        });
      } catch (e) {
        setStakingNearError(e as Error);
      } finally {
        setIsStakingNear(false);
      }
    },
    [mutateStakeNear, lockupAccountId, queryClient]
  );

  return { stakeNear, isStakingNear, stakingNearError };
};
