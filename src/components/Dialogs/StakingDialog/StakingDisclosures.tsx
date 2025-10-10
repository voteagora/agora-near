import { ArrowLeft } from "lucide-react";
import { memo, useCallback } from "react";

type StakingDisclosuresProps = {
  onBack: () => void;
};

export const StakingDisclosures = memo(
  ({ onBack }: StakingDisclosuresProps) => {
    const handleBackClick = useCallback(() => {
      onBack();
    }, [onBack]);

    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 hover:text-gray-900"
          >
            <ArrowLeft width={16} height={16} />
            <span className="text-sm font-bold">Back</span>
          </button>
        </div>

        <div className="my-2">
          <h1 className="text-2xl font-bold text-gray-900">Disclosures</h1>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Staking NEAR Earns Rewards
            </h2>
            <p className="text-[#3C3C3C] leading-relaxed text-sm">
              Staking your NEAR tokens enables you to earn rewards through a
              supported staking pool. Reward rates are not fixed and depend on
              validator performance and network conditions.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Displayed APY Is an Estimate
            </h2>
            <p className="text-[#3C3C3C] leading-relaxed text-sm">
              The APY you see is only an estimate based on recent performance.
              Actual returns may vary and are not guaranteed.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Unstaking Must Be Done Through the Pool
            </h2>
            <p className="text-[#3C3C3C] leading-relaxed text-sm">
              To unstake your tokens, you must visit the staking pool&apos;s
              website.
            </p>
            <p className="text-[#3C3C3C] leading-relaxed mt-4 text-sm">
              You&apos;ll need to unstake there before you can unlock or move
              your tokens through this platform.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Unstaking May Involve a Delay
            </h2>
            <p className="text-[#3C3C3C] leading-relaxed text-sm">
              Some staking pools have an unbonding or cooldown period before
              your tokens are fully withdrawable. This varies by pool and is
              outside of our control.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Smart Contract Use
            </h2>
            <p className="text-[#3C3C3C] leading-relaxed text-sm">
              Locking and unlocking NEAR involves smart contracts. While
              reviewed for security, using smart contracts carries inherent
              risk.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

StakingDisclosures.displayName = "DisclosuresDialog";
