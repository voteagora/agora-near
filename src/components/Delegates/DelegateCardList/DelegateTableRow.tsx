"use client";

import { DelegateChunk } from "@/app/api/common/delegates/delegate";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/tokenUtils";
import { useRouter } from "next/navigation";
import { DelegateProfileImage } from "../DelegateCard/DelegateProfileImage";

export default function DelegateTableRow({
  delegate,
}: {
  delegate: DelegateChunk & { numOfDelegators: bigint };
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
        <DelegateProfileImage
          endorsed={delegate.statement?.endorsed}
          address={delegate.address}
        />
      </TableCell>
      <TableCell>{formatNumber(delegate.votingPower.total)}</TableCell>
      <TableCell>{`80%`}</TableCell>
      {/* @ts-ignore */}
      <TableCell>
        {delegate.numOfDelegators?.toString() || 0} addresses
      </TableCell>
    </TableRow>
  );
}
