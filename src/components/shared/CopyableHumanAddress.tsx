"use client";

import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

function CopyableHumanAddress({
  address,
  className = "",
  shouldTruncate = true,
}: {
  address: string;
  className?: string;
  shouldTruncate?: boolean;
}) {
  const [isInCopiedState, setIsInCopiedState] = useState<boolean>(false);

  useEffect(() => {
    let id: NodeJS.Timeout | number | null = null;
    if (isInCopiedState) {
      id = setTimeout(() => {
        setIsInCopiedState(false);
      }, 750);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [isInCopiedState]);

  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center cursor-pointer group text-primary",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        setIsInCopiedState(true);
      }}
    >
      <span className={cn(shouldTruncate && "truncate max-w-[120px]")}>
        {address}
      </span>
      <div className="flex flex-shrink">
        {isInCopiedState ? (
          <CheckCircleIcon className="text-green-600 w-3 h-3" />
        ) : (
          <Copy className="w-3 h-3 hidden group-hover:block group-hover:opacity-90" />
        )}
      </div>
    </div>
  );
}

export default CopyableHumanAddress;
