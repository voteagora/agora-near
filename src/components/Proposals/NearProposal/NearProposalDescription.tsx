import Markdown from "@/components/shared/Markdown/Markdown";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import styles from "./NearProposalDescription.module.scss";

export default function NearProposalDescription({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  return (
    <div
      className={`flex flex-col gap-4 sm:w-[48rem] w-full max-w-[calc(100vw-2rem)] sm:max-w-none`}
    >
      <div className="flex-col items-start">
        <div className="text-xs font-semibold text-secondary flex items-center">
          Proposal by {proposal.proposer_id}
          {proposal.link && (
            <a
              href={proposal.link.startsWith("http") || proposal.link.startsWith("https") ? proposal.link : `https://${proposal.link}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
        <h2 className="font-black text-2xl text-primary">{proposal.title}</h2>
      </div>
      <div className="flex flex-col gap-2">
        <div className={styles.proposal_description_md}>
          <Markdown
            content={proposal.description ?? ""}
          />
        </div>
      </div>
    </div>
  )
}