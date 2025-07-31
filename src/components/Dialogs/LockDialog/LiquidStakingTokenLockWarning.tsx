import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type LiquidStakingTokenLockWarningProps = {
  symbol?: string;
  onLearnMorePressed: () => void;
};

export const LiquidStakingTokenLockWarning = ({
  symbol,
  onLearnMorePressed,
}: LiquidStakingTokenLockWarningProps) => {
  return (
    <div className="flex flex-row items-start bg-[#F9F8F7] p-2 rounded-lg">
      <div>
        <ExclamationCircleIcon
          width={24}
          height={24}
          className="text-[#B60D0D]"
        />
      </div>
      <p className="text-sm ml-2">
        Once you transfer your {symbol || "tokens"}, you will not be able to
        withdraw without unstaking first.{" "}
        <Link
          onClick={onLearnMorePressed}
          href="/info?item=fungible-token-withdrawal"
          className="underline"
        >
          Learn more
        </Link>
      </p>
    </div>
  );
};
