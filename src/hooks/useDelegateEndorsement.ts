import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDelegateEndorsed } from "@/lib/api/delegates/requests";
import { toast } from "react-hot-toast";

export const useDelegateEndorsement = () => {
  const queryClient = useQueryClient();

  const toggleEndorsement = useMutation({
    mutationFn: ({
      address,
      endorsed,
    }: {
      address: string;
      endorsed: boolean;
    }) => setDelegateEndorsed(address, endorsed),
    onSuccess: (_, { address, endorsed }) => {
      toast.success(
        endorsed
          ? "Delegate endorsed successfully"
          : "Delegate endorsement removed"
      );

      queryClient.invalidateQueries({
        queryKey: ["delegate", address],
      });

      queryClient.invalidateQueries({
        queryKey: ["delegates"],
      });
    },
    onError: (error) => {
      console.error("Error toggling endorsement:", error);
      toast.error("Failed to update endorsement");
    },
  });

  return {
    toggleEndorsement: toggleEndorsement.mutate,
    isToggling: toggleEndorsement.isPending,
    error: toggleEndorsement.error,
  };
};
