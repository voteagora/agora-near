import { useNear } from "@/contexts/NearContext";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { UpdatedButton } from "../Button";

export const AccountActionsButton = memo(() => {
  const { signedAccountId } = useNear();

  const route = useRouter();

  if (!signedAccountId) {
    return null;
  }

  // TODO (AXB-34): Button to create a delegate statement

  return (
    <div className="flex flex-col gap-2">
      <UpdatedButton
        type="secondary"
        className="w-full"
        onClick={() => route.push(`/delegates/${signedAccountId}`)}
      >
        View my profile
      </UpdatedButton>
    </div>
  );
});

AccountActionsButton.displayName = "AccountActionsButton";
