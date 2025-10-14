"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProposalConfig } from "@/hooks/useProposalConfig";

const GovernorSettingsParams = () => {
  const { votingDuration, isLoading } = useProposalConfig();

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
          <TableCell className="text-base font-semibold text-left text-secondary rounded-bl-xl">
            Voting Period
          </TableCell>
          <TableCell className="text-base font-semibold text-right text-primary rounded-br-xl">
            {isLoading ? "-" : votingDuration}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
export default GovernorSettingsParams;
