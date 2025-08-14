"use client";

import { useApprovedProposals } from "@/hooks/useApprovedProposals";

interface Props {
  participationRate?: string | null;
}

export const DelegateCardHeader = ({ participationRate }: Props) => {
  const percentParticipation = Number(participationRate) * 100;
  const numProposalsOutOfTen = Number(participationRate) * 10;

  const { totalProposals } = useApprovedProposals({ pageSize: 10 });

  if (!totalProposals || totalProposals < 10) return null;

  return Number(participationRate) > 0.5 ? (
    <ActiveHeader
      outOfTen={numProposalsOutOfTen}
      totalProposals={10}
      percentParticipation={percentParticipation}
    />
  ) : (
    <InactiveHeader
      outOfTen={numProposalsOutOfTen}
      totalProposals={10}
      percentParticipation={percentParticipation}
    />
  );
};

const ActiveHeader = ({
  outOfTen,
  totalProposals,
  percentParticipation,
}: {
  outOfTen: number;
  totalProposals: number;
  percentParticipation: number;
}) => {
  return (
    <CardHeader
      title="Active delegate"
      cornerTitle={`🎉 ${percentParticipation}%`}
      subtitle={`Voted in ${outOfTen}/${Math.min(10, totalProposals)} of the most recent proposals`}
    />
  );
};

const InactiveHeader = ({
  outOfTen,
  totalProposals,
  percentParticipation,
}: {
  outOfTen: number;
  totalProposals: number;
  percentParticipation: number;
}) => {
  return (
    <CardHeader
      title="Inactive delegate"
      cornerTitle={`💤 ${percentParticipation}%`}
      subtitle={`Voted in ${outOfTen}/${Math.min(10, totalProposals)} of the most recent proposals`}
    />
  );
};

const CardHeader = ({
  title,
  cornerTitle,
  subtitle,
}: {
  title: string;
  cornerTitle: string;
  subtitle: string;
}) => {
  return (
    <div className="px-4 pt-4 pb-8 border border-line bg-tertiary/5 rounded-lg mb-[-16px]">
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-row justify-between">
          <h3 className="text-primary font-bold">{title}</h3>
          <span className="text-primary font-bold">{cornerTitle}</span>
        </div>
        <p className="text-xs text-tertiary">{subtitle}</p>
      </div>
    </div>
  );
};
