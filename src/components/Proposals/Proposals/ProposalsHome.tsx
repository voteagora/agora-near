import Tenant from "@/lib/tenant/tenant";
import Proposals from "@/components/Proposals/Proposals/Proposals";
import Hero from "@/components/Hero/Hero";

export default async function ProposalsHome() {
  const { ui } = Tenant.current();

  if (!ui.toggle("proposals")) {
    return <div>Route not supported for namespace</div>;
  }

  return (
    <div className="flex flex-col">
      <Hero page="proposals" />
      <Proposals />
    </div>
  );
}
