import { TokenWithBalance } from "@/lib/types";
import { yoctoNearToUsdFormatted } from "@/lib/utils";
import { usePrice } from "@/hooks/usePrice";
import { useLockProviderContext } from "../LockProvider";
import Image from "next/image";
import TokenAmount from "../../shared/TokenAmount";
import { Skeleton } from "../../ui/skeleton";

type AssetSelectorProps = {
  handleTokenSelect: (token: TokenWithBalance) => void;
};

export const AssetSelector = ({ handleTokenSelect }: AssetSelectorProps) => {
  const { availableTokens } = useLockProviderContext();
  const { price, isLoading: isLoadingPrice } = usePrice();

  return (
    <div className="flex flex-col items-center w-full bg-neutral w-full h-full">
      <div className="flex justify-start w-full mb-6">
        <h2 className="text-2xl font-bold text-primary">Select Asset</h2>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {availableTokens.map((token: TokenWithBalance, index: number) => {
          return (
            <button
              key={index}
              onClick={() => handleTokenSelect(token)}
              className="flex flex-row items-center justify-between w-full py-2 rounded-lg text-left"
            >
              <div className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm shrink-0 relative">
                  {token.metadata?.icon ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={token.metadata.icon}
                        alt={token.metadata.name}
                        width={0}
                        height={0}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ) : (
                    token.metadata?.name.substring(0, 1)
                  )}
                </div>
                <div>
                  <p className="font-medium text-primary">
                    {token.metadata?.symbol}
                  </p>
                  <p className="text-xs text-secondary text-[#676767]">
                    {token.type === "lockup" ? (
                      "Lockup Contract"
                    ) : (
                      <span
                        className="truncate max-w-[120px]"
                        title={token.accountId}
                      >
                        {token.accountId}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <TokenAmount
                  amount={token.balance}
                  currency={token.metadata?.symbol}
                  minimumFractionDigits={4}
                  className="text-primary font-medium"
                />
                {isLoadingPrice ? (
                  <Skeleton className="w-16 h-4" />
                ) : (
                  <p className="text-xs text-secondary tabular-nums text-[#676767]">
                    {yoctoNearToUsdFormatted(token.balance, String(price))}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
