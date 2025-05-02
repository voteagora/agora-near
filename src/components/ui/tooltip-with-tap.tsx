"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function useHasHover() {
  const [hasHover, setHasHover] = React.useState(true);

  React.useEffect(() => {
    try {
      setHasHover(window.matchMedia("(hover: hover)").matches);
    } catch {
      // Assume that if browser too old to support matchMedia it's likely not a touch device
      setHasHover(true);
    }
  }, []);

  return hasHover;
}

interface TooltipWithTapProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function TooltipWithTap({
  children,
  content,
  className,
  side = "top",
  align = "center",
  sideOffset = 4,
}: TooltipWithTapProps) {
  const [open, setOpen] = React.useState(false);
  const hasHover = useHasHover();

  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={setOpen}
        delayDuration={hasHover ? 300 : 0}
      >
        <TooltipTrigger
          onClick={(e) => {
            if (!hasHover) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          asChild
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={className}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
