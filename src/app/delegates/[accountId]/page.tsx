import { Metadata } from "next";

import { DelegateProfileContent } from "@/components/Delegates/DelegateProfile/DelegateProfileContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { accountId: string };
}): Promise<Metadata> {
  const address = params.accountId;

  const title = `${address} on Agora`;
  const description = `See what ${address} believes and how they vote on NEAR governance.`;

  return {
    title: title,
    description: description,
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Page({ params }: { params: { accountId: string } }) {
  const address = params.accountId;

  return <DelegateProfileContent address={address} />;
}
