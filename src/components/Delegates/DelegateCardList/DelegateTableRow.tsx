"use client";

import TokenAmount from "@/components/shared/TokenAmount";
import { TableCell, TableRow } from "@/components/ui/table";
import { DelegateProfile } from "@/lib/api/delegates/types";
import { useRouter } from "next/navigation";
import { DelegateAddress } from "../DelegateCard/DelegateAddress";
import { EndorsedTooltip } from "./EndorsedTooltip";

export default function DelegateTableRow({
  delegate,
}: {
  delegate: DelegateProfile;
}) {
  const router = useRouter();
  const endorsed = delegate.endorsed;

  return (
    <TableRow
      className="font-semibold cursor-pointer bg-neutral text-secondary"
      onClick={() => {
        router.push(`/delegates/${delegate.address}`);
      }}
    >
      <TableCell className="hidden sm:flex gap-2 items-center">
        <DelegateAddress address={delegate.address} shouldTruncate={false} />
        {endorsed && <EndorsedTooltip />}
      </TableCell>
      <TableCell className="flex sm:hidden gap-2 items-center">
        <DelegateAddress address={delegate.address} />
        {endorsed && <EndorsedTooltip />}
      </TableCell>
      <TableCell>
        {delegate.votingPower ? (
          <TokenAmount
            amount={delegate.votingPower ?? "0"}
            minimumFractionDigits={1}
            maximumSignificantDigits={1}
            currency="veNEAR"
          />
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
}
