import { useCallback, useState } from "react";
import { useWriteHOSContract } from "./useWriteHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { useQueryClient } from "@tanstack/react-query";
import {
  READ_NEAR_CONTRACT_QK,
  useReadHOSContract,
} from "./useReadHOSContract";
import { STAKED_BALANCE_QK } from "./useStakedBalance";

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

  return {
    stakeNear,
    unstakeNear,
    withdrawNear,
    isStakingNear,
    isUnstakingNear,
    isWithdrawingNear,
    stakingNearError,
    unstakingNearError,
    withdrawingNearError,
  };
};
