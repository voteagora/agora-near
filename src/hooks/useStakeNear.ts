import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { STAKED_BALANCE_QK } from "./useStakedBalance";
import { useWriteHOSContract } from "./useWriteHOSContract";

type Props = {
  lockupAccountId: string;
};

export const useStakeNear = ({ lockupAccountId }: Props) => {
  const [isStakingNear, setIsStakingNear] = useState(false);
  const [isUnstakingNear, setIsUnstakingNear] = useState(false);
  const [isWithdrawingNear, setIsWithdrawingNear] = useState(false);
  const [stakingNearError, setStakingNearError] = useState<Error | null>(null);
  const [unstakingNearError, setUnstakingNearError] = useState<Error | null>(
    null
  );
  const [withdrawingNearError, setWithdrawingNearError] =
    useState<Error | null>(null);

  const [isUnstakingAll, setIsUnstakingAll] = useState(false);
  const [isWithdrawingAll, setIsWithdrawingAll] = useState(false);
  const [unstakingAllError, setUnstakingAllError] = useState<Error | null>(
    null
  );
  const [withdrawingAllError, setWithdrawingAllError] = useState<Error | null>(
    null
  );

  const { mutateAsync: mutateStakeNear } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const queryClient = useQueryClient();

  const stakeNear = useCallback(
    async (amount: string) => {
      try {
        setIsStakingNear(true);
        setStakingNearError(null);

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

        queryClient.invalidateQueries({
          queryKey: [STAKED_BALANCE_QK, lockupAccountId],
        });
      } catch (e) {
        setStakingNearError(e as Error);
      } finally {
        setIsStakingNear(false);
      }
    },
    [mutateStakeNear, lockupAccountId, queryClient]
  );

  const unstakeNear = useCallback(
    async (amount: string) => {
      try {
        setIsUnstakingNear(true);
        setUnstakingNearError(null);

        await mutateStakeNear({
          contractId: lockupAccountId,
          methodCalls: [
            {
              methodName: "unstake",
              args: { amount },
            },
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
        });
      } catch (e) {
        setUnstakingNearError(e as Error);
      } finally {
        setIsUnstakingNear(false);
      }
    },
    [mutateStakeNear, lockupAccountId, queryClient]
  );

  const withdrawNear = useCallback(
    async (amount: string) => {
      try {
        setIsWithdrawingNear(true);
        setWithdrawingNearError(null);

        await mutateStakeNear({
          contractId: lockupAccountId,
          methodCalls: [
            {
              methodName: "withdraw_from_staking_pool",
              args: { amount },
            },
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
        });
      } catch (e) {
        setWithdrawingNearError(e as Error);
      } finally {
        setIsWithdrawingNear(false);
      }
    },
    [mutateStakeNear, lockupAccountId, queryClient]
  );

  const unstakeAll = useCallback(async () => {
    try {
      setIsUnstakingAll(true);
      setUnstakingAllError(null);

      await mutateStakeNear({
        contractId: lockupAccountId,
        methodCalls: [
          {
            methodName: "unstake_all",
            args: {},
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
      });
    } catch (e) {
      setUnstakingAllError(e as Error);
    } finally {
      setIsUnstakingAll(false);
    }
  }, [mutateStakeNear, lockupAccountId, queryClient]);

  const withdrawAll = useCallback(async () => {
    try {
      setIsWithdrawingAll(true);
      setWithdrawingAllError(null);

      await mutateStakeNear({
        contractId: lockupAccountId,
        methodCalls: [
          {
            methodName: "withdraw_all_from_staking_pool",
            args: {},
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
      });
    } catch (e) {
      setWithdrawingAllError(e as Error);
    } finally {
      setIsWithdrawingAll(false);
    }
  }, [mutateStakeNear, lockupAccountId, queryClient]);

  return {
    stakeNear,
    unstakeNear,
    unstakeAll,
    withdrawNear,
    withdrawAll,
    isStakingNear,
    isUnstakingNear,
    isUnstakingAll,
    isWithdrawingNear,
    isWithdrawingAll,
    stakingNearError,
    unstakingNearError,
    unstakingAllError,
    withdrawingNearError,
    withdrawingAllError,
  };
};
