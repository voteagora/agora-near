import { AssetsHome } from "@/components/Assets/AssetsHome";
import ResourceNotFound from "@/components/shared/ResourceNotFound/ResourceNotFound";
import Tenant from "@/lib/tenant/tenant";

export async function generateMetadata() {
  const { ui } = Tenant.current();

  const page = ui.page("assets");
  const { title, description, imageTitle, imageDescription } = page!.meta;

  const preview = `/api/images/og/generic?title=${encodeURIComponent(
    imageTitle
  )}&description=${encodeURIComponent(imageDescription)}`;

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

export default function AssetsPage() {
  const { ui } = Tenant.current();

  if (!ui.toggle("assets")?.enabled) {
    return (
      <ResourceNotFound message="Hmm... can't find that page, please check again." />
    );
  }

  return <AssetsHome />;
}
