"use client";

import Image from "next/image";
import { UpdatedButton } from "@/components/Button";
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
            <UpdatedButton type="primary" variant="rounded" href={ctaHref}>
              {ctaLabel}
            </UpdatedButton>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-[60vh] text-center">
      <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        <AnimatedStars />
      </div>
      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        <AnimatedStars />
      </div>
      <div className="flex flex-col items-center">
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
            <UpdatedButton type="primary" variant="rounded" href={ctaHref}>
              {ctaLabel}
            </UpdatedButton>
          </div>
        )}
      </div>
    </div>
  );
}
