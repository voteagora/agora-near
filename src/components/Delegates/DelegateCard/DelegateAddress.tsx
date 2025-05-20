"use client";

import CopyableHumanAddress from "../../shared/CopyableHumanAddress";

interface Props {
  address: string;
  shouldTruncate?: boolean;
}

export function DelegateAddress({ address, shouldTruncate = true }: Props) {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex flex-col">
        <div className="text-primary flex flex-row gap-1 font-semibold hover:opacity-90">
          <CopyableHumanAddress
            address={address}
            shouldTruncate={shouldTruncate}
          />
        </div>
      </div>
    </div>
  );
}
