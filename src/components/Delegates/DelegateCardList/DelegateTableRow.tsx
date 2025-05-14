"use client";

import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { TableCell, TableRow } from "@/components/ui/table";
import { DelegateProfile } from "@/lib/api/delegates/types";
import { useRouter } from "next/navigation";
import { DelegateAddress } from "../DelegateCard/DelegateAddress";
import { formatNearAccountId } from "@/lib/utils";

export default function DelegateTableRow({
  delegate,
}: {
  delegate: DelegateProfile;
}) {
  const router = useRouter();

  return (
    <TableRow
      className="font-semibold cursor-pointer bg-neutral text-secondary"
      onClick={() => {
        router.push(`/delegates/${delegate.address}`);
      }}
    >
      <TableCell>
        <DelegateAddress address={formatNearAccountId(delegate.address)} />
      </TableCell>
      <TableCell>
        {delegate.votingPower ? (
          <NearTokenAmount
            amount={delegate.votingPower ?? "0"}
            currency="veNEAR"
          />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {delegate.participationRate
          ? `${Number(delegate.participationRate) * 100}%`
          : "-"}
      </TableCell>
      <TableCell>
        {delegate.numOfDelegators
          ? `${delegate.numOfDelegators} addresses`
          : "-"}
      </TableCell>
    </TableRow>
  );
}
