import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { READ_NEAR_CONTRACT_QK } from "./useReadHOSContract";
import { STAKED_BALANCE_QK } from "./useStakedBalance";
import { UNSTAKED_BALANCE_QK } from "./useUnstakedBalance";
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
        console.log("[stakeNear] start", { lockupAccountId, amount });
        setIsStakingNear(true);
        setStakingNearError(null);

        console.log("[stakeNear] calling deposit_and_stake");
        await mutateStakeNear({
          contractId: lockupAccountId,
          methodCalls: [
            {
              methodName: "deposit_and_stake",
              args: { amount },
            },
          ],
        });

        console.log("[stakeNear] invalidating READ_NEAR_CONTRACT_QK", {
          contractId: lockupAccountId,
          key: READ_NEAR_CONTRACT_QK,
        });
        queryClient.invalidateQueries({
          queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
        });

        console.log("[stakeNear] invalidating STAKED_BALANCE_QK", {
          contractId: lockupAccountId,
          key: STAKED_BALANCE_QK,
        });
        queryClient.invalidateQueries({
          queryKey: [STAKED_BALANCE_QK, lockupAccountId],
        });
      } catch (e) {
        console.error("[stakeNear] error", e);
        setStakingNearError(e as Error);
        throw e;
      } finally {
        setIsStakingNear(false);
        console.log("[stakeNear] end");
      }
    },
    [mutateStakeNear, lockupAccountId, queryClient]
  );

  const unstakeNear = useCallback(
    async (amount: string) => {
      try {
        console.log("[unstakeNear] start", { lockupAccountId, amount });
        setIsUnstakingNear(true);
        setUnstakingNearError(null);

        console.log("[unstakeNear] calling unstake");
        await mutateStakeNear({
          contractId: lockupAccountId,
          methodCalls: [
            {
              methodName: "unstake",
              args: { amount },
            },
          ],
        });

        console.log("[unstakeNear] invalidating READ_NEAR_CONTRACT_QK", {
          contractId: lockupAccountId,
          key: READ_NEAR_CONTRACT_QK,
        });
        queryClient.invalidateQueries({
          queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
        });

        queryClient.invalidateQueries({
          queryKey: [STAKED_BALANCE_QK],
        });

        queryClient.invalidateQueries({
          queryKey: [UNSTAKED_BALANCE_QK],
        });
      } catch (e) {
        console.error("[unstakeNear] error", e);
        setUnstakingNearError(e as Error);
        throw e;
      } finally {
        setIsUnstakingNear(false);
        console.log("[unstakeNear] end");
      }
    },
    [mutateStakeNear, lockupAccountId, queryClient]
  );

  const withdrawNear = useCallback(
    async (amount: string) => {
      try {
        console.log("[withdrawNear] start", { lockupAccountId, amount });
        setIsWithdrawingNear(true);
        setWithdrawingNearError(null);

        console.log("[withdrawNear] calling withdraw_from_staking_pool");
        await mutateStakeNear({
          contractId: lockupAccountId,
          methodCalls: [
            {
              methodName: "withdraw_from_staking_pool",
              args: { amount },
            },
          ],
        });

        console.log("[withdrawNear] invalidating READ_NEAR_CONTRACT_QK", {
          contractId: lockupAccountId,
          key: READ_NEAR_CONTRACT_QK,
        });
        queryClient.invalidateQueries({
          queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
        });
      } catch (e) {
        console.error("[withdrawNear] error", e);
        setWithdrawingNearError(e as Error);
        throw e;
      } finally {
        setIsWithdrawingNear(false);
        console.log("[withdrawNear] end");
      }
    },
    [mutateStakeNear, lockupAccountId, queryClient]
  );

  const unstakeAll = useCallback(async () => {
    try {
      console.log("[unstakeAll] start", { lockupAccountId });
      setIsUnstakingAll(true);
      setUnstakingAllError(null);

      console.log("[unstakeAll] calling unstake_all");
      await mutateStakeNear({
        contractId: lockupAccountId,
        methodCalls: [
          {
            methodName: "unstake_all",
            args: {},
          },
        ],
      });

      console.log("[unstakeAll] invalidating READ_NEAR_CONTRACT_QK", {
        contractId: lockupAccountId,
        key: READ_NEAR_CONTRACT_QK,
      });
      queryClient.invalidateQueries({
        queryKey: [READ_NEAR_CONTRACT_QK, lockupAccountId],
      });

      queryClient.invalidateQueries({
        queryKey: [STAKED_BALANCE_QK],
      });

      queryClient.invalidateQueries({
        queryKey: [UNSTAKED_BALANCE_QK],
      });
    } catch (e) {
      console.error("[unstakeAll] error", e);
      setUnstakingAllError(e as Error);
      throw e;
    } finally {
      setIsUnstakingAll(false);
      console.log("[unstakeAll] end");
    }
  }, [mutateStakeNear, lockupAccountId, queryClient]);

  const withdrawAll = useCallback(async () => {
    try {
      console.log("[withdrawAll] start", { lockupAccountId });
      setIsWithdrawingAll(true);
      setWithdrawingAllError(null);

      console.log("[withdrawAll] calling withdraw_all_from_staking_pool");
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
      console.error("[withdrawAll] error", e);
      setWithdrawingAllError(e as Error);
      throw e;
    } finally {
      setIsWithdrawingAll(false);
      console.log("[withdrawAll] end");
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
