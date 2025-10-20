"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedStars } from "@/components/Assets/AnimatedStars";
import logo from "@/assets/agora_logo.svg";

interface ResourceNotFoundProps {
  message?: string;
  ctaHref?: string;
  ctaLabel?: string;
  decorated?: boolean;
  showCTA?: boolean;
}

export default function ResourceNotFound({
  message,
  ctaHref = "/",
  ctaLabel = "Go home",
  decorated = false,
  showCTA = false,
}: ResourceNotFoundProps) {
  const defaultMessage = "We couldn't find what you were looking for.";
  if (!decorated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <Image
          className={"my-6"}
          alt="Agora"
          width={40}
          height={40}
          src={logo}
        />
        <p className="text-md text-secondary max-w-md">
          {message || defaultMessage}
        </p>
        {showCTA && (
          <div className="mt-6">
            <Link
              href={ctaHref}
              className="font-semibold py-2 px-4 border border-line cursor-pointer rounded-full bg-brandPrimary hover:bg-brandPrimary/90 text-neutral transition-shadow"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center md:flex-row md:items-center md:justify-center md:gap-8">
      <div className="hidden md:block pointer-events-none select-none shrink-0">
        <AnimatedStars className="mr-8" />
      </div>
      <div className="flex flex-col items-center max-w-md">
        <Image
          className={"my-6"}
          alt="Agora"
          width={40}
          height={40}
          src={logo}
        />
        <h1 className="text-2xl font-semibold text-primary mb-2">Oops...</h1>
        <p className="text-md text-secondary max-w-md">
          {message || defaultMessage}
        </p>
        {showCTA && (
          <div className="mt-6">
            <Link
              href={ctaHref}
              className="font-semibold py-2 px-4 border border-line cursor-pointer rounded-full bg-brandPrimary hover:bg-brandPrimary/90 text-neutral transition-shadow"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
      <div className="hidden md:block pointer-events-none select-none shrink-0">
        <AnimatedStars className="ml-8" />
      </div>
    </div>
  );
}
