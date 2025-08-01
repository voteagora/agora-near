import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import linkIcon from "@/assets/link.svg";
import Link from "next/link";

const nearUrl =
  process.env.NEXT_PUBLIC_AGORA_ENV === "prod"
    ? "https://nearblocks.io"
    : "https://testnet.nearblocks.io";

const ContractList = () => {
  const list = [
    {
      title: "veNEAR",
      address: process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID ?? "",
    },
    {
      title: "Governor",
      address: process.env.NEXT_PUBLIC_NEAR_VOTING_CONTRACT_ID ?? "",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            colSpan={4}
            className="font-semibold text-secondary bg-wash rounded-t-lg"
          >
            Contracts
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((contract, index) => (
          <TableRow key={index}>
            <TableCell
              className={`pr-1 font-semibold text-secondary ${
                index === list.length - 1 && "rounded-bl-lg"
              }`}
            >
              {contract.title}
            </TableCell>
            <TableCell className="px-1 text-base font-semibold text-primary">
              {contract.address}
            </TableCell>
            <TableCell
              className={`px-1 ${index === list.length - 1 && "rounded-br-lg"}`}
            >
              <Link
                href={`${nearUrl}/address/${contract.address}`}
                target="_blank"
              >
                <Image
                  alt={contract.title}
                  width={20}
                  height={20}
                  src={linkIcon}
                />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContractList;
