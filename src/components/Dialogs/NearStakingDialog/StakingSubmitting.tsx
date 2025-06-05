import coin from "@/assets/icons/coin.svg";
import { UpdatedButton } from "@/components/Button";
import NearTokenAmount from "@/components/shared/NearTokenAmount";
import Image from "next/image";
import { useStakingProviderContext } from "../StakingProvider";

export const StakingSubmitting = () => {
  const { enteredAmountYoctoNear } = useStakingProviderContext();

  return (
    <div className="flex flex-col h-full items-center w-full justify-center">
      <div className="flex-1 flex flex-col justify-end items-center gap-6">
        <Image src={coin} alt="coin" width={60} height={60} />
        <div className="text-center">
          <p className="text-md text-gray-500 mb-2">
            Submitting your stake request...
          </p>
          <div className="text-4xl font-bold text-gray-900">
            <NearTokenAmount amount={enteredAmountYoctoNear} />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end w-full">
        <UpdatedButton
          type="secondary"
          className="flex w-full justify-center items-center"
          variant="rounded"
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </UpdatedButton>
      </div>
    </div>
  );
};
