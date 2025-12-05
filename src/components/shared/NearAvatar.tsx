"use client";

import Image from "next/image";
import nearDelegateAvatar from "@/assets/icons/nearDelegateAvatar.svg";

interface NearAvatarProps {
  accountId?: string;
  className?: string;
  size?: number;
}

export default function NearAvatar({
  className = "",
  size = 44,
}: NearAvatarProps) {
  return (
    <div
      className={`overflow-hidden rounded-full flex justify-center items-center ${className}`}
    >
      <Image
        alt="NEAR Avatar"
        className="animate-in"
        src={nearDelegateAvatar}
        width={size}
        height={size}
        priority
      />
    </div>
  );
}
