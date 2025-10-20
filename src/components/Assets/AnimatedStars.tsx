"use client";

import { memo } from "react";

const StarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 drop-shadow-[0_0_6px_rgba(0,230,160,0.8)]"
    aria-label="Green sparkle"
  >
    <path
      fill="#00E6A0"
      d="M50 2
        C47 22 34 34 2 50
        C34 66 47 78 50 98
        C53 78 66 66 98 50
        C66 34 53 22 50 2Z"
    />
  </svg>
);

export const AnimatedStars = memo(() => {
  return (
    <div className="flex flex-col justify-center gap-4 ml-8">
      <div className="animate-star-pulse-1">
        <StarIcon />
      </div>
      <div className="animate-star-pulse-2">
        <StarIcon />
      </div>
      <div className="animate-star-pulse-3">
        <StarIcon />
      </div>
      <div className="animate-star-pulse-4">
        <StarIcon />
      </div>
    </div>
  );
});

AnimatedStars.displayName = "AnimatedStars";
