import { useHouseOfStakeOnboardingContext } from "@/components/Onboarding/HouseOfStakeOnboardingProvider";
import { useNear } from "@/contexts/NearContext";
import { useLockNear } from "./useLockNear";
import { useRegisterLockup } from "./useRegisterLockup";
import { useSelectStakingPool } from "./useSelectStakingPool";
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
    preferredStakingPoolId,
    venearAccountInfo,
    currentStakingPoolId,
    enteredAmount,
  } = useHouseOfStakeOnboardingContext();

  const { registerAndDeployLockupAsync } = useRegisterLockup({});

  const { lockNearAsync } = useLockNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { selectStakingPoolAsync } = useSelectStakingPool({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { stakeNear } = useStakeNear({
    lockupAccountId: lockupAccountId ?? "",
  });

  const { mutateAsync: writeLockupContract } = useWriteHOSContract({
    contractType: "LOCKUP",
  });

  const executeOnboarding = useCallback(async () => {
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

    if (!enteredAmount || Big(enteredAmount).lte(0)) {
      throw new Error("Invalid amount entered");
    }

    // Step 1: Deploy lockup
    if (!venearAccountInfo) {
      await registerAndDeployLockupAsync(
        storageDepositAmount ?? "",
        lockupDeploymentCost ?? ""
      );
    }

    // Step 2: Select staking pool if one hasn't already been selected
    // TODO: Handle switching pools
    if (preferredStakingPoolId && !currentStakingPoolId) {
      setStep(Step.SELECT_STAKING_POOL);
      await selectStakingPoolAsync({ stakingPoolId: preferredStakingPoolId });
    }

    // Convert entered amount to yoctoNEAR for NEAR transfers
    const amountToTransfer = utils.format.parseNearAmount(enteredAmount) || "0";

    if (amountToTransfer === "0") {
      throw new Error("Invalid amount to transfer");
    }

    // Check if user has enough balance for gas fees
    const accountNearBalance = await getBalance(signedAccountId);
    const paddingForGas = utils.format.parseNearAmount("0.20") || "0";

    const totalRequired =
      selectedToken.type === "near"
        ? new Big(amountToTransfer).plus(paddingForGas)
        : new Big(paddingForGas);

    if (totalRequired.gt(accountNearBalance)) {
      throw new Error("Insufficient balance for transfer including gas fees");
    }

    // Step 3: Transfer funds
    setStep(Step.TRANSFER_FUNDS);
    if (selectedToken.type === "near") {
      await transferNear({
        receiverId: lockupAccountId,
        amount: amountToTransfer,
      });
    } else {
      await transferFungibleToken({
        tokenContractId: selectedToken.contractId ?? "",
        receiverId: lockupAccountId,
        amount: amountToTransfer,
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

    // Step 4: Lock the transferred amount
    setStep(Step.LOCK_NEAR);
    await lockNearAsync({});

    // Step 5: Stake the amount if it's not a LST
    if (selectedToken.type === "near") {
      const availableToStake = (await viewMethod({
        contractId: lockupAccountId,
        method: "get_liquid_owners_balance",
        args: {},
      })) as string | null;

      if (availableToStake) {
        setStep(Step.STAKE_NEAR);
        await stakeNear(availableToStake);
      }
    }

    setStep(Step.COMPLETED);
  }, [
    currentStakingPoolId,
    enteredAmount,
    getBalance,
    lockNearAsync,
    lockupAccountId,
    lockupDeploymentCost,
    preferredStakingPoolId,
    registerAndDeployLockupAsync,
    selectStakingPoolAsync,
    selectedToken,
    signedAccountId,
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
