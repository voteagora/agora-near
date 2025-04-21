import { useCallback, useState } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";

type Props = {
  lockupAccountId: string;
};

export const useStakeNear = ({ lockupAccountId }: Props) => {
  const [isStakingNear, setIsStakingNear] = useState(false);
  const [stakingNearError, setStakingNearError] = useState<Error | null>(null);
  const { mutateAsync: mutateStakeNear } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const stakeNear = useCallback(
    async (amount: string, stakingPoolId: string) => {
      try {
        setIsStakingNear(true);
        setStakingNearError(null);

        // TODO: This approach will not work for MyNearWallet since it navigates away from the page and doesn't complete the depost_and_stake part of the txn
        await mutateStakeNear({
          contractId: lockupAccountId,
          methodCalls: [
            {
              methodName: "select_staking_pool",
              args: { staking_pool_account_id: stakingPoolId },
            },
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
      } catch (e) {
        setStakingNearError(e as Error);
      } finally {
        setIsStakingNear(false);
      }
    },
    [mutateStakeNear, lockupAccountId]
  );

  return { stakeNear, isStakingNear, stakingNearError };
};
