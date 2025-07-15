"use client";

import Tenant from "@/lib/tenant/tenant";
import { usePathname } from "next/navigation";
import { HeaderLink } from "./HeaderLink";

export default function Navbar() {
  const pathname = usePathname();
  const { ui } = Tenant.current();

  const hasProposals = ui.toggle("proposals") && ui.toggle("proposals").enabled;
  const hasProposalsHref = Boolean(ui.page("proposals")?.href);

  return (
    <div
      className={`flex flex-row bg-wash rounded-full border border-line p-1 font-medium`}
    >
      {hasProposals && (
        <HeaderLink
          href={hasProposalsHref ? ui.page("proposals")?.href : "/proposals"}
          target={hasProposalsHref ? "_blank" : "_self"}
          isActive={pathname.includes("proposals") || pathname === "/"}
        >
          Proposals
        </HeaderLink>
      )}

      {ui.toggle("delegates") && ui.toggle("delegates").enabled && (
        <HeaderLink href="/delegates" isActive={pathname.includes("delegates")}>
          Voters
        </HeaderLink>
      )}

      {ui.toggle("assets") && ui.toggle("assets").enabled && (
        <HeaderLink href="/assets" isActive={pathname.includes("assets")}>
          Assets
        </HeaderLink>
      )}

      {ui.toggle("info") && ui.toggle("info").enabled && (
        <HeaderLink href="/info" isActive={pathname.includes("info")}>
          Info
        </HeaderLink>
      )}
    </div>
  );
}
