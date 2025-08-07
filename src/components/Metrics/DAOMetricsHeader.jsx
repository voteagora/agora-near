"use client";

import discord from "@/assets/discord.svg";
import github from "@/assets/github.svg";
import twitter from "@/assets/x.svg";
import telegram from "@/assets/telegram.svg";
import Tenant from "@/lib/tenant/tenant";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import TokenAmount from "@/components/shared/TokenAmount";

import { useTotalSupply } from "@/hooks/useTotalNearSupply";

export default function DAOMetricsHeader() {
  const { ui } = Tenant.current();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { totalSupply: totalSupplyFromNear, isLoading: isLoadingSupply } =
    useTotalSupply();

  const governanceForumLink = ui.link("governance-forum");
  const bugsLink = ui.link("bugs");
  const changeLogLink = ui.link("changelog");
  const faqLink = ui.link("faq");
  const discordLink = ui.link("discord");
  const githubLink = ui.link("github");
  const twitterLink = ui.link("twitter");
  const telegramLink = ui.link("telegram");
  const blogLink = ui.link("blog");
  const agoraLink = ui.link("agora");

  // social links + agora are hidden on mobile
  const hasLinksMobile =
    !!governanceForumLink ||
    !!bugsLink ||
    !!changeLogLink ||
    !!faqLink ||
    !!blogLink;
  const hasLinksDesktop =
    hasLinksMobile ||
    !!discordLink ||
    !!githubLink ||
    !!twitterLink ||
    !!telegramLink ||
    !!agoraLink;

  useEffect(() => {
    setIsClient(true);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isClient || isMobile) {
    return null;
  } else {
    return (
      <>
        {createPortal(
          <div className="sticky z-50 bottom-0 sm:bottom-0 left-0 flex justify-center">
            <div
              className={cn(
                "flex flex-col sm:flex-row w-full bg-wash shadow-newDefault",
                "border-t border-r border-l border-line rounded-tl-2xl rounded-tr-2xl",
                "text-xs text-secondary font-inter font-medium",
                `transition-all duration-200 ease-in-out transform sm:transition-none sm:translate-y-0`
              )}
            >
              <div className="w-full sm:w-3/5 flex items-center px-6 sm:px-8 gap-8 justify-between sm:justify-start h-10">
                <div className="flex gap-6 sm:gap-8">
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger>
                      <span className="cursor-default">
                        {isLoadingSupply || !totalSupplyFromNear ? (
                          "-"
                        ) : (
                          <TokenAmount amount={totalSupplyFromNear} />
                        )}
                        <span className="hidden sm:inline">supply</span>
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full shadow text-primary"
                      side="bottom"
                      sideOffset={3}
                    >
                      <span>Total amount of NEAR in existence</span>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
              <div className="block bg-line w-full sm:w-[1px] h-[1px] sm:h-10"></div>
              <div
                className={`w-full sm:w-2/5 justify-end items-center px-6 sm:px-8 gap-4 h-10 ${
                  hasLinksMobile
                    ? "flex"
                    : hasLinksDesktop
                      ? "hidden sm:flex"
                      : "hidden"
                }`}
              >
                <a href="/terms-of-service" className="text-center">
                  Terms of Service
                </a>

                {governanceForumLink && (
                  <a
                    href={governanceForumLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="text-center"
                  >
                    {governanceForumLink.title}
                  </a>
                )}
                {bugsLink && (
                  <a
                    href={bugsLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="text-center"
                  >
                    {bugsLink.title}
                  </a>
                )}
                {changeLogLink && (
                  <Link href={changeLogLink.url} className="text-center">
                    {changeLogLink.title}
                  </Link>
                )}
                {faqLink && (
                  <a
                    href={faqLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="text-center"
                  >
                    {faqLink.title}
                  </a>
                )}

                {blogLink && (
                  <a
                    href={blogLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="text-center"
                  >
                    Blog
                  </a>
                )}

                {discordLink && (
                  <a
                    href={discordLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="hidden sm:inline"
                  >
                    <Image src={discord} alt={discordLink.title} />
                  </a>
                )}

                {githubLink && (
                  <a
                    href={githubLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="hidden sm:inline"
                  >
                    <Image src={github} alt={githubLink.title} />
                  </a>
                )}

                {twitterLink && (
                  <a
                    href={twitterLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="hidden sm:inline"
                  >
                    <Image src={twitter} alt={twitterLink.title} />
                  </a>
                )}

                {telegramLink && (
                  <a
                    href={telegramLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="hidden sm:inline"
                  >
                    <Image src={telegram} alt={telegramLink.title} />
                  </a>
                )}

                {agoraLink && (
                  <a
                    href={agoraLink.url}
                    rel="noreferrer nonopener"
                    target="_blank"
                    className="hidden sm:inline"
                  >
                    {agoraLink.title}
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }
}
