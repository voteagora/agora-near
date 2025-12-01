import Markdown from "@/components/shared/Markdown/Markdown";
import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import styles from "./ProposalDescription.module.scss";
import ProposalChart from "../ProposalPage/ProposalChart/ProposalChart";

export default function ProposalDescription({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex-col items-start">
        <div className="text-xs font-semibold text-secondary flex items-center">
          Proposal by {proposal.proposer_id}
          {proposal.link && (
            <a
              href={
                proposal.link.startsWith("http") ||
                proposal.link.startsWith("https")
                  ? proposal.link
                  : `https://${proposal.link}`
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
        <h2 className="font-black text-2xl text-primary break-words">{proposal.title}</h2>
      </div>
      {proposal.status !== ProposalStatus.Created &&
        proposal.status !== ProposalStatus.Rejected && (
          <ProposalChart proposal={proposal} />
        )}
      <div className="flex flex-col gap-2">
        <div className={styles.proposal_description_md}>
          <Markdown content={proposal.description ?? ""} />
        </div>
      </div>
    </div>
  );
}
