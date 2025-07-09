import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { icons } from "@/icons/icons";
import Image from "next/image";

export const EndorsedTooltip = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <Image src={icons.endorsed} alt="Endorsed" className="w-4 h-4" />
        </TooltipTrigger>

        <TooltipContent>
          <div className="text-xs">Verified by NEAR</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
