"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReadHOSContract } from "@/hooks/useReadHOSContract";
import { TESTNET_CONTRACTS } from "@/lib/contractConstants";
import { getVotingDays } from "@/lib/proposalUtils";

const GovernorSettingsParams = () => {
  const [{ data: config }] = useReadHOSContract([
    {
      contractId: TESTNET_CONTRACTS.VOTING_CONTRACT_ID,
      methodName: "get_config",
      config: {
        args: {},
        staleTime: Infinity,
        gcTime: 0,
      },
    },
  ]);

  const votingDuration = getVotingDays({ voting_duration_ns: config?.voting_duration_ns ?? "" });

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
            {votingDuration}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
export default GovernorSettingsParams;
