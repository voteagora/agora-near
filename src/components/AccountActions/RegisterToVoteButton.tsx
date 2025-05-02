import { Button } from "../ui/button";
import NearTokenAmount from "../shared/NearTokenAmount";
import { InfoIcon } from "lucide-react";
import { useVenearConfig } from "@/hooks/useVenearConfig";
import { useRegisterLockup } from "@/hooks/useRegisterLockup";
import toast from "react-hot-toast";
import { TooltipWithTap } from "@/components/ui/tooltip-with-tap";

export const RegisterToVoteButton = () => {
  const { totalRegistrationCost, lockupStorageCost, venearStorageCost } =
    useVenearConfig({
      enabled: true,
    });

  const {
    registerAndDeployLockup,
    isPending: isRegisteringToVote,
    error,
  } = useRegisterLockup({
    onSuccess: () => {
      toast.success("Voter registration successful");
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="flex flex-row items-center gap-2"
        disabled={isRegisteringToVote}
        onClick={() =>
          registerAndDeployLockup(
            String(venearStorageCost),
            String(lockupStorageCost)
          )
        }
      >
        {isRegisteringToVote ? (
          "Registering..."
        ) : error ? (
          "Error registering - try again"
        ) : (
          <div className="flex flex-row items-center gap-2 justify-center">
            <p className="text-sm">
              Deposit <NearTokenAmount amount={totalRegistrationCost} />{" "}
              {" to vote"}
            </p>
            <TooltipWithTap
              content={
                <div className="max-w-[350px] text-left p-3">
                  <h4 className="font-semibold mb-2">
                    Registration Requirements
                  </h4>
                  <p className="mb-4">
                    To participate in voting, you&apos;ll need to make two
                    deposits:
                  </p>

                  <div className="space-y-4">
                    <div className="border-b border-neutral-200 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Account Deposit:</span>
                        <NearTokenAmount amount={venearStorageCost} />
                      </div>
                      <p className="text-sm mt-1 text-neutral-600">
                        This covers your account storage in the veNEAR contract.
                        This amount is locked immediately and cannot be
                        withdrawn.
                      </p>
                    </div>

                    <div className="border-b border-neutral-200 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Lockup Deposit:</span>
                        <NearTokenAmount amount={lockupStorageCost} />
                      </div>
                      <p className="text-sm mt-1 text-neutral-600">
                        This covers your lockup contract&apos;s deployment and
                        storage costs. This is refundable, and can be locked but
                        cannot be staked.
                      </p>
                    </div>

                    <div className="pt-2 font-bold">
                      <div className="flex justify-between items-center">
                        <span>Total Required:</span>
                        <NearTokenAmount amount={totalRegistrationCost} />
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <InfoIcon size={14} className="opacity-60" />
            </TooltipWithTap>
          </div>
        )}
      </Button>
    </div>
  );
};
