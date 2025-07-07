"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Tenant from "@/lib/tenant/tenant";
import { cn } from "@/lib/utils";

const GovernorSettingsParams = () => {
  const { contracts } = Tenant.current();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-base font-semibold text-left text-secondary bg-wash rounded-tl-lg">
            Parameter
          </TableHead>
          <TableHead className="text-base font-semibold text-secondary text-right bg-wash rounded-tr-lg">
            Value
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-base font-semibold text-left text-secondary">
            Voting Delay
          </TableCell>
          <TableCell className="text-base font-semibold text-right text-primary">
            0s
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            className={cn(
              "text-base font-semibold text-left text-secondary",
              !contracts.timelock && "rounded-bl-xl"
            )}
          >
            Voting Period
          </TableCell>
          <TableCell
            className={cn(
              "text-base font-semibold text-right text-primary",
              !contracts.timelock && "rounded-br-xl"
            )}
          >
            1d
          </TableCell>
        </TableRow>
        {contracts.timelock && (
          <TableRow>
            <TableCell className="text-base font-semibold text-left text-secondary rounded-bl-xl">
              Timelock Delay
            </TableCell>
            <TableCell className="text-base font-semibold text-right text-primary rounded-br-xl">
              Signal Only
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default GovernorSettingsParams;
