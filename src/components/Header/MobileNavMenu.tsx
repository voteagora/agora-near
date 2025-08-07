import React from "react";
import { Drawer } from "../ui/Drawer";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Tenant from "@/lib/tenant/tenant";
import Image from "next/image";

import { useTotalSupply } from "@/hooks/useTotalNearSupply";
import TokenAmount from "@/components/shared/TokenAmount";
import agoraIconWithText from "@/assets/agoraIconWithText.svg";
import discordIcon from "@/assets/discord.svg";

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavMenu({ isOpen, onClose }: MobileNavMenuProps) {
  const pathname = usePathname() || "";
  const { ui } = Tenant.current();
  const { totalSupply: totalSupplyFromNear, isLoading: isLoadingSupply } =
    useTotalSupply();

  // Links
  const governanceForumLink = ui.link("governance-forum");
  const bugsLink = ui.link("bugs");
  const discordLink = ui.link("discord");

  const proposalsToggle = ui.toggle("proposals");
  const hasProposals = proposalsToggle !== undefined && proposalsToggle.enabled;
  const hasProposalsHref = ui.page("proposals")?.href !== undefined;

  const delegatesToggle = ui.toggle("delegates");
  const hasDelegates = delegatesToggle !== undefined && delegatesToggle.enabled;

  const assetsToggle = ui.toggle("assets");
  const hasAssets = assetsToggle !== undefined && assetsToggle.enabled;

  const infoToggle = ui.toggle("info");
  const hasInfo = infoToggle !== undefined && infoToggle.enabled;

  const navItems = [
    ...(hasProposals
      ? [
          {
            name: "Proposals",
            href: hasProposalsHref
              ? ui.page("proposals")?.href || "/proposals"
              : "/proposals",
            target: hasProposalsHref ? "_blank" : "_self",
            isActive: pathname.includes("proposals") || pathname === "/",
          },
        ]
      : []),
    ...(hasDelegates
      ? [
          {
            name: "Voters",
            href: "/delegates",
            target: "_self",
            isActive: pathname.includes("delegates"),
          },
        ]
      : []),
    ...(hasAssets
      ? [
          {
            name: "Assets",
            href: "/assets",
            target: "_self",
            isActive: pathname.includes("assets"),
          },
        ]
      : []),
    ...(hasInfo
      ? [
          {
            name: "Info",
            href: "/info",
            target: "_self",
            isActive: pathname.includes("info"),
          },
        ]
      : []),
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="left" title="Menu">
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <div className="pl-4 pr-6 py-8 flex flex-col justify-start items-start text-primary">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.target}
              onClick={onClose}
              className={cn(
                "self-stretch pl-4 pr-2 py-2 h-12 flex items-center",
                item.isActive ? "bg-tertiary/10" : ""
              )}
            >
              <div className="font-semibold">{item.name}</div>
            </Link>
          ))}
        </div>

        {/* Bottom Sections - Fixed to bottom */}
        <div className="mt-auto">
          {/* Metrics Section */}
          {totalSupplyFromNear && parseFloat(totalSupplyFromNear) > 0 && (
            <div className="px-8 py-6 border-t border-line">
              <div className="text-tertiary text-sm font-semibold">
                {isLoadingSupply ? (
                  "-"
                ) : (
                  <TokenAmount amount={totalSupplyFromNear} />
                )}
                Total Supply
              </div>
            </div>
          )}

          {/* Links Section */}
          {(governanceForumLink || bugsLink || discordLink) && (
            <div className="px-8 py-6 border-t border-line">
              <div className="flex flex-col space-y-4">
                {governanceForumLink && (
                  <>
                    <a
                      href={governanceForumLink.url}
                      rel="noreferrer nonopener"
                      target="_blank"
                      className="text-tertiary"
                    >
                      {governanceForumLink.title}
                    </a>
                    <div className="border-b border-line w-full"></div>
                  </>
                )}
                {bugsLink && (
                  <>
                    <a
                      href={bugsLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-tertiary"
                    >
                      {bugsLink.title}
                    </a>
                    <div className="border-b border-line w-full"></div>
                  </>
                )}
                {discordLink && (
                  <>
                    <a
                      href={discordLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-tertiary"
                    >
                      {discordLink.title}
                      <Image
                        src={discordIcon}
                        alt="Discord"
                        width={20}
                        height={20}
                        className="opacity-70"
                      />
                    </a>
                    <div className="border-b border-line w-full"></div>
                  </>
                )}
                <a href="/terms-of-service" className="text-tertiary">
                  Terms of Service
                </a>
              </div>
            </div>
          )}

          {/* Agora Logo Section */}
          <div className="p-8 bg-neutral-50 flex justify-start items-center gap-2">
            <Image
              src={agoraIconWithText}
              alt="Agora Logo"
              width={82}
              height={21}
            />
            <div className="justify-start text-primary font-normal text-sm">
              Onchain Governance
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default MobileNavMenu;
