import Tenant from "@/lib/tenant/tenant";
import Proposals from "@/components/Proposals/Proposals/Proposals";
import Hero from "@/components/Hero/Hero";
import SubscribeDialogLauncher from "@/components/Notifications/SubscribeDialogLauncher";

export default async function ProposalsHome() {
  const { ui } = Tenant.current();
  const supportsNotifications = ui.toggle("email-subscriptions")?.enabled;

  if (!ui.toggle("proposals")) {
    return <div>Route not supported for namespace</div>;
  }

  return (
    <div className="flex flex-col">
      {supportsNotifications && <SubscribeDialogLauncher />}
      <Hero page="proposals" />
      <Proposals />
    </div>
  );
}
