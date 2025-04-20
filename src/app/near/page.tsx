import Tenant from "@/lib/tenant/tenant";
import NearWalletClient from "./NearWalletClient";

export async function generateMetadata({}) {
  const tenant = Tenant.current();
  const page = tenant.ui.page("/near");

  const { title, description } = page?.meta || {
    title: "NEAR Wallet Connection",
    description: "Connect and manage your NEAR wallet",
  };

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

export default function NearWalletPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NearWalletClient />
    </div>
  );
}
