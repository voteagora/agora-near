import Tenant from "@/lib/tenant/tenant";
import NearProposals from "@/components/Proposals/NearProposals/NearProposals";
import Hero from "@/components/Hero/Hero";

export default async function ProposalsHome() {
  const { ui } = Tenant.current();

  if (!ui.toggle("proposals")) {
    return <div>Route not supported for namespace</div>;
  }

  return (
    <div className="flex flex-col">
      <Hero page="proposals" />
      <NearProposals />
    </div>
  );
}
