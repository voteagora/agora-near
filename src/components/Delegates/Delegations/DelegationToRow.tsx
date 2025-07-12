"use client";

import TokenAmount from "@/components/shared/TokenAmount";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBlockExplorerUrl } from "@/hooks/useBlockExplorerUrl";
import { DelegationEvent } from "@/lib/api/delegates/types";
import { formatNearAccountId } from "@/lib/utils";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import Link from "next/link";

export default function DelegationToRow({
  delegation,
}: {
  delegation: DelegationEvent;
}) {
  const getTransactionUrl = useBlockExplorerUrl();

  return (
    <TableRow>
      <TableCell>
        <TokenAmount amount={delegation.nearAmount ?? "0"} currency="veNEAR" />
      </TableCell>
      <TableCell>{format(delegation.eventDate, "MM/dd/yyyy")}</TableCell>
      <TableCell>
        <Link
          href={`/delegates/${delegation.delegateeId}`}
          title={`Address ${delegation.delegateeId}`}
        >
          {formatNearAccountId(delegation.delegateeId)}
        </Link>
      </TableCell>
      <TableCell>
        <a
          href={getTransactionUrl(delegation.blockHash)} // TODO: Pass in txn hash instead of block hash
          target="_blank"
          rel="noreferrer noopener"
        >
          View
          <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2 inline align-text-bottom" />
        </a>
      </TableCell>
    </TableRow>
  );
}
