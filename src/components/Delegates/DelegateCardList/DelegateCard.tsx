import { DelegateChunk } from "@/app/api/common/delegates/delegate";
import { sanitizeContent } from "@/lib/sanitizationUtils";
import Tenant from "@/lib/tenant/tenant";
import { formatNumber } from "@/lib/tokenUtils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NearDelegateActions } from "../DelegateCard/NearDelegateActions";

const DelegateCard = ({
  delegate,
  isDelegatesFiltering,
  truncatedStatement,
}: {
  delegate: DelegateChunk;
  isDelegatesFiltering: boolean;
  truncatedStatement: string;
}) => {
  const { token } = Tenant.current();

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
                {formatNumber(delegate.votingPower.total)} {token.symbol}
              </span>
              <span className="text-primary font-bold">80% Participation</span>
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
