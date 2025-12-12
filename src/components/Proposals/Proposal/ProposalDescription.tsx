import Markdown from "@/components/shared/Markdown/Markdown";
import { ProposalInfo, ProposalStatus } from "@/lib/contracts/types/voting";
import { decodeMetadata, ProposalType } from "@/lib/proposalMetadata";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import ProposalChart from "../ProposalPage/ProposalChart/ProposalChart";
import styles from "./ProposalDescription.module.scss";

export default function ProposalDescription({
  proposal,
}: {
  proposal: ProposalInfo;
}) {
  const { metadata, description: cleanDescription } = decodeMetadata(
    proposal.description ?? ""
  );

  return (
    <div className="flex flex-col gap-4 w-full min-w-0 flex-1 break-words">
      <div className="flex-col items-start min-w-0">
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

        {/* Metadata Display for Tactical Proposals */}
        {metadata?.proposalType === ProposalType.Tactical && (
          <div className="mt-2 mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 shadow-sm">
                Tactical Proposal
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-xs text-blue-700 font-medium">
              {metadata.quorumThreshold && (
                <span>
                  Quorum: {metadata.quorumThreshold.toLocaleString()} votes
                </span>
              )}
              {metadata.approvalThreshold && (
                <span>
                  Approval: {metadata.approvalThreshold.toLocaleString()} votes
                </span>
              )}
            </div>
          </div>
        )}

        <h2
          className="font-black text-2xl text-primary max-w-full"
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        >
          {proposal.title}
        </h2>
      </div>
      {proposal.status !== ProposalStatus.Created &&
        proposal.status !== ProposalStatus.Rejected && (
          <ProposalChart proposal={proposal} />
        )}
      <div className="flex flex-col gap-2">
        <div className={styles.proposal_description_md}>
          <Markdown content={cleanDescription} />
        </div>
      </div>
    </div>
  );
}
