import React from "react";
import InfoAbout from "@/app/info/components/InfoAbout";
import { InfoHero } from "@/app/info/components/InfoHero";

import { ChartTreasury } from "@/app/info/components/ChartTreasury";
import GovernorSettings from "@/app/info/components/GovernorSettings";
import GovernanceCharts from "@/app/info/components/GovernanceCharts";
import InfoFAQ from "@/app/info/components/InfoFAQ";
import InfoRoadmap from "@/app/info/components/InfoRoadmap";
import Tenant from "@/lib/tenant/tenant";
import { FREQUENCY_FILTERS, TENANT_NAMESPACES } from "@/lib/constants";
import { apiFetchTreasuryBalanceTS } from "@/app/api/balances/[frequency]/getTreasuryBalanceTS";
import { apiFetchDelegateWeights } from "@/app/api/analytics/top/delegates/getTopDelegateWeighs";
import { apiFetchProposalVoteCounts } from "@/app/api/analytics/vote/getProposalVoteCounts";
import { apiFetchMetricTS } from "@/app/api/analytics/metric/[metric_id]/[frequency]/getMetricsTS";
import Hero from "@/components/Hero/Hero";

export async function generateMetadata() {
  const tenant = Tenant.current();
  const page = tenant.ui.page("info") || tenant.ui.page("/");

  const { title, description } = page!.meta;

  const preview = `/api/images/og/generic?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}`;

  return {
    title: title,
    description: description,
    openGraph: {
      images: [
        {
          url: preview,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page() {
  const { ui, namespace } = Tenant.current();

  if (!ui.toggle("info")?.enabled) {
    return (
      <div className="text-primary">Route not supported for namespace</div>
    );
  }

  const hasGovernanceCharts =
    ui.toggle("info/governance-charts")?.enabled === true;

  const treasuryData = await apiFetchTreasuryBalanceTS(FREQUENCY_FILTERS.YEAR);

  return (
    <div className="flex flex-col">
      <InfoHero />
      <InfoAbout />
      <GovernorSettings />
      <InfoFAQ />
      <InfoRoadmap />
      {treasuryData.result.length > 0 && (
        <ChartTreasury
          initialData={treasuryData.result}
          getData={async (frequency: string) => {
            "use server";
            return apiFetchTreasuryBalanceTS(frequency);
          }}
        />
      )}
      {hasGovernanceCharts && (
        <GovernanceCharts
          getDelegates={async () => {
            "use server";
            return apiFetchDelegateWeights();
          }}
          getVotes={async () => {
            "use server";
            return apiFetchProposalVoteCounts();
          }}
          getMetrics={async (metric: string, frequency: string) => {
            "use server";
            return apiFetchMetricTS(metric, frequency);
          }}
        />
      )}
    </div>
  );
}
