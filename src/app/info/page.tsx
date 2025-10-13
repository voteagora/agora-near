import React from "react";
import InfoAbout from "@/app/info/components/InfoAbout";
import { InfoHero } from "@/app/info/components/InfoHero";
import { VeNearGoalBar } from "@/app/info/components/VeNearGoalBar";

import GovernorSettings from "@/app/info/components/GovernorSettings";
import InfoFAQ from "@/app/info/components/InfoFAQ";
import InfoRoadmap from "@/app/info/components/InfoRoadmap";
import Tenant from "@/lib/tenant/tenant";

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
  const { ui } = Tenant.current();

  if (!ui.toggle("info")?.enabled) {
    return (
      <div className="text-primary">Route not supported for namespace</div>
    );
  }

  return (
    <div className="flex flex-col">
      <InfoHero />
      <VeNearGoalBar />
      <InfoAbout />
      <GovernorSettings />
      <InfoFAQ />
      <InfoRoadmap />
    </div>
  );
}
