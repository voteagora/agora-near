"use client";

import Tenant from "@/lib/tenant/tenant";
import Image from "next/image";

interface NearAvatarProps {
  accountId?: string;
  className?: string;
  size?: number;
}

export default function NearAvatar({
  accountId,
  className = "",
  size = 44,
}: NearAvatarProps) {
  const { ui } = Tenant.current();

  return (
    <div
      className={`overflow-hidden rounded-full flex justify-center items-center ${className}`}
    >
      <Image
        alt="NEAR Avatar"
        className="animate-in"
        src="/assets/icons/nearDelegateAvatar.svg"
        width={size}
        height={size}
      />
    </div>
  );
} 