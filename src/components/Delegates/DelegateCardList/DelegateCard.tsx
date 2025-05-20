import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { DelegateProfile } from "@/lib/api/delegates/types";
import { sanitizeContent, stripMarkdown } from "@/lib/sanitizationUtils";
import { cn, formatNearAccountId } from "@/lib/utils";
import Link from "next/link";
import { NearDelegateActions } from "../DelegateCard/NearDelegateActions";

type DelegateCardProps = {
  delegate: DelegateProfile;
  isDelegatesFiltering: boolean;
};

const DelegateCard = ({
  delegate,
  isDelegatesFiltering,
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
              {formatNearAccountId(delegate.address)}
            </div>
            <div className="px-4 flex flex-row gap-4 min-h-[24px]">
              <span className="text-primary font-bold">
                <NearTokenAmount
                  amount={delegate.votingPower ?? "0"}
                  currency="veNEAR"
                />
              </span>
              <span className="text-primary font-bold">
                {Number(delegate.participationRate ?? 0) * 100}% Participation
              </span>
            </div>
            <div className="min-h-[48px] px-4">
              {sanitizedTruncatedStatement ? (
                <p className="text-base leading-normal break-words text-secondary overflow-hidden line-clamp-2">
                  {sanitizedTruncatedStatement}
                </p>
              ) : (
                <p className="hidden"></p>
              )}
            </div>
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
