"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { formatNearAccountId, formatNearBlockHash } from "@/lib/utils";
import Link from "next/link";
import { DelegationEvent } from "@/lib/api/delegates/types";
import NearTokenAmount from "@/components/shared/NearTokenAmount";

export default function DelegationToRow({
  delegation,
}: {
  delegation: DelegationEvent;
}) {
  return (
    <TableRow>
      <TableCell>
        <NearTokenAmount amount={delegation.nearAmount ?? "0"} />
      </TableCell>
      <TableCell>{delegation.eventDate}</TableCell>
      <TableCell>
        <Link
          href={`/delegates/${delegation.delegateeId}`}
          title={`Address ${delegation.delegateeId}`}
        >
          {formatNearAccountId(delegation.delegateeId)}
        </Link>
      </TableCell>
      <TableCell>
        {formatNearBlockHash(delegation.blockHash)}
      </TableCell>
    </TableRow>
  );
}
