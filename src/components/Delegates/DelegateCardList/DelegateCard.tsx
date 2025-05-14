import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { DelegateProfile } from "@/lib/api/delegates/types";
import { sanitizeContent, stripMarkdown } from "@/lib/sanitizationUtils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NearDelegateActions } from "../DelegateCard/NearDelegateActions";

type DelegateCardProps = {
  delegate: DelegateProfile;
  isDelegatesFiltering: boolean;
  votingPower: string;
};

const DelegateCard = ({
  delegate,
  isDelegatesFiltering,
  votingPower,
}: DelegateCardProps) => {
  const truncatedStatement = stripMarkdown(delegate.statement ?? "").slice(
    0,
    120
  );

  const sanitizedTruncatedStatement = sanitizeContent(truncatedStatement);

  return (
    <div
      key={delegate.address}
      className={cn(
        "flex flex-col",
        isDelegatesFiltering ? "animate-pulse" : ""
      )}
    >
      <Link href={`/delegates/${delegate.address}`}>
        <div className="flex flex-col gap-4 h-full rounded-xl bg-wash border border-line shadow-newDefault">
          <div className="flex flex-col gap-4 justify-center pt-4">
            <div className="border-b border-line px-4 pb-4">
              {delegate.address}
            </div>
            <div className="px-4 flex flex-row gap-4">
              <span className="text-primary font-bold">
                <NearTokenAmount amount={votingPower} currency="veNEAR" />
              </span>
              {delegate.participationRate && (
                <span className="text-primary font-bold">
                  {Number(delegate.participationRate) * 100}% Participation
                </span>
              )}
            </div>
            <p className="text-base leading-normal min-h-[48px] break-words text-secondary overflow-hidden line-clamp-2 px-4">
              {sanitizedTruncatedStatement}
            </p>
          </div>
          <div className="min-h-[24px] px-4 pb-4">
            <NearDelegateActions delegate={delegate} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DelegateCard;
