"use client";

import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { DialogProvider } from "@/components/Dialogs/DialogProvider/DialogProvider";
import { DelegateChunk } from "@/app/api/common/delegates/delegate";
import { useAgoraContext } from "@/contexts/AgoraContext";
import { PaginatedResult, PaginationParams } from "@/app/lib/pagination";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DelegateTableRow from "./DelegateTableRow";

interface Props {
  initialDelegates: PaginatedResult<DelegateChunk[]>;
}

export default function DelegateTable({ initialDelegates }: Props) {
  const [delegates, setDelegates] = useState(initialDelegates.data);

  const { setIsDelegatesFiltering } = useAgoraContext();

  useEffect(() => {
    setIsDelegatesFiltering(false);
    setDelegates(initialDelegates.data);
  }, [initialDelegates, setIsDelegatesFiltering]);

  const loadMore = async () => {};

  return (
    <DialogProvider>
      <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg mt-6">
        <Table className="min-w-full">
          <TableHeader className="text-sm text-secondary sticky top-0 bg-neutral z-10 rounded-t-lg">
            <TableRow className="bg-tertiary/5">
              <TableHead className="h-10 text-secondary">Name</TableHead>
              <TableHead className="h-10 text-secondary">
                Voting power
              </TableHead>
              <TableHead className="h-10 text-secondary">
                Participation
              </TableHead>
              <TableHead className="h-10 text-secondary">
                Delegated from
              </TableHead>
            </TableRow>
          </TableHeader>
          <InfiniteScroll
            hasMore={false}
            pageStart={1}
            loadMore={loadMore}
            loader={
              <TableRow key={0}>
                <TableCell
                  key="loader"
                  className="gl_loader justify-center py-6 text-sm text-secondary"
                >
                  Loading...
                </TableCell>
              </TableRow>
            }
            // References styles of TableBody
            className="[&_tr:last-child]:border-0"
            element="tbody"
            useWindow={false}
          >
            {delegates.length === 0 ? (
              <td
                className="w-full p-4 bg-neutral text-center text-secondary text-sm"
                colSpan={6}
              >
                None found
              </td>
            ) : (
              delegates.map((delegate) => (
                <DelegateTableRow
                  key={delegate.address}
                  delegate={
                    delegate as DelegateChunk & { numOfDelegators: bigint }
                  }
                />
              ))
            )}
          </InfiniteScroll>
        </Table>
      </div>
    </DialogProvider>
  );
}
