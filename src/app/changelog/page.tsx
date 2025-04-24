import ChangelogList from "@/components/Changelog/ChangelogList";
import Tenant from "@/lib/tenant/tenant";

export async function generateMetadata() {
  const { brandName } = Tenant.current();
  return {
    title: `${brandName} Gov Client Changelog - Agora`,
    description: `Stay up to date with the latest changes with Agora's development for the ${brandName} community.`,
  };
}

export default async function Page() {
  return (
    <div className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <ChangelogList
          initChangelog={{
            data: [],
            meta: { has_next: false, next_offset: 0 },
          }}
          fetchChangelogForDAO={async ({ limit, offset }) => {
            "use server";
            return { data: [], meta: { has_next: false, next_offset: 0 } };
          }}
        />
      </div>
    </div>
  );
}
