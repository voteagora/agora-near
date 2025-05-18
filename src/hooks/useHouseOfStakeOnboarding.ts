import { useHouseOfStakeOnboardingContext } from "@/components/Onboarding/HouseOfStakeOnboardingProvider";
import { useNear } from "@/contexts/NearContext";
import { useLockNear } from "./useLockNear";
import { useRegisterLockup } from "./useRegisterLockup";
import { useLockupStakingPool } from "./useSelectedStakingPool";
import { useStakeNear } from "./useStakeNear";
import { useCallback, useState } from "react";
import { utils } from "near-api-js";
import Big from "big.js";
import { useWriteHOSContract } from "./useWriteHOSContract";

enum Step {
  DEPLOY_LOCKUP,
  SELECT_STAKING_POOL,
  TRANSFER_FUNDS,
  LOCK_NEAR,
  STAKE_NEAR,
  COMPLETED,
}

export const useHouseOfStakeOnboarding = () => {
  const {
    viewMethod,
    transferNear,
    transferFungibleToken,
    getBalance,
    signedAccountId,
  } = useNear();
  const [step, setStep] = useState<Step>(Step.DEPLOY_LOCKUP);

  const {
    lockupAccountId,
    storageDepositAmount,
    lockupDeploymentCost,
    selectedToken,
    selectedStakingPoolId,
    venearAccountInfo,
  } = useHouseOfStakeOnboardingContext();

  const { registerAndDeployLockupAsync } = useRegisterLockup({});

  const { lockNearAsync } = useLockNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { selectStakingPoolAsync } = useLockupStakingPool({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { stakeNear } = useStakeNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { mutateAsync: writeLockupContract } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const executeOnboarding = useCallback(async () => {
    // TODO: Check what state the account is in and skip steps as needed

    // Lockup account ID is deterministic and should be available even before lockup is deployed
    if (!lockupAccountId) {
      throw new Error("Lockup account ID not defined");
    }

    if (!selectedToken) {
      throw new Error("No token selected");
    }

    if (!signedAccountId) {
      throw new Error("Wallet not connected");
    }

    // Step 1: Deploy lockup
    if (!venearAccountInfo) {
      await registerAndDeployLockupAsync(
        storageDepositAmount ?? "",
        lockupDeploymentCost ?? ""
      );
    }

    // Step 2: Select staking pool
    if (selectedStakingPoolId) {
      setStep(Step.SELECT_STAKING_POOL);
      await selectStakingPoolAsync({ stakingPoolId: selectedStakingPoolId });
    }

    const accountNearBalance = await getBalance(signedAccountId);
    const paddingForGas = utils.format.parseNearAmount("0.20");

    if (!paddingForGas) {
      throw new Error("Failed to parse gas buffer amount");
    }

    const balanceToTransfer =
      selectedToken.type === "near"
        ? new Big(accountNearBalance).minus(paddingForGas)
        : new Big(selectedToken.balance);

    if (balanceToTransfer.lte(0)) {
      throw new Error("Insufficient balance for transfer");
    }

    const transferAmount = balanceToTransfer.toFixed();

    // Step 3: Transfer funds
    setStep(Step.TRANSFER_FUNDS);
    if (selectedToken.type === "near") {
      await transferNear({
        receiverId: lockupAccountId,
        amount: transferAmount,
      });
    } else {
      await transferFungibleToken({
        tokenContractId: selectedToken.contractId ?? "",
        receiverId: lockupAccountId,
        amount: transferAmount,
      });

      // Refresh the balance
      await writeLockupContract({
        contractId: lockupAccountId,
        methodCalls: [
          {
            methodName: "refresh_staking_pool_balance",
            args: {},
          },
        ],
      });
    }

    // Step 4: Lock max amount
    setStep(Step.LOCK_NEAR);
    await lockNearAsync({});

    // Step 5: Stake the max amount if it's not a LST
    if (selectedToken.type === "near") {
      const availableToStake = (await viewMethod({
        contractId: lockupAccountId,
        method: "get_liquid_owners_balance",
        args: {},
      })) as string | null;

      if (availableToStake) {
        setStep(Step.STAKE_NEAR);
        await stakeNear(availableToStake, selectedStakingPoolId);
      }
    }

    setStep(Step.COMPLETED);
  }, [
    lockNearAsync,
    lockupAccountId,
    lockupDeploymentCost,
    registerAndDeployLockupAsync,
    selectStakingPoolAsync,
    selectedStakingPoolId,
    selectedToken,
    stakeNear,
    storageDepositAmount,
    transferFungibleToken,
    transferNear,
    venearAccountInfo,
    viewMethod,
    writeLockupContract,
  ]);

  return {
    step,
    executeOnboarding,
  };
};
