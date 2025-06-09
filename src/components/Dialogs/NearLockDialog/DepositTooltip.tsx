import NearTokenAmount from "@/components/shared/NearTokenAmount";
import { TooltipWithTap } from "@/components/ui/tooltip-with-tap";
import { InfoIcon } from "lucide-react";

type DepositLineItem = {
  amount: string;
  title: string;
  description: string;
};

type DepositToolTipProps = {
  lineItems: DepositLineItem[];
  totalDeposit: string;
  title: string;
  subtitle: string;
};

export const DepositTooltip = ({
  lineItems,
  totalDeposit,
  title,
  subtitle,
}: DepositToolTipProps) => {
  return (
    <TooltipWithTap
      content={
        <div className="max-w-[350px] text-left p-3">
          <h4 className="font-semibold mb-2">{title}</h4>
          <p className="mb-4">{subtitle}</p>
          <div className="space-y-4">
            {lineItems.map((item) => (
              <div
                className="border-b border-neutral-200 pb-2"
                key={item.title}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{item.title}:</span>
                  <NearTokenAmount amount={item.amount} />
                </div>
                <p className="text-sm mt-1 text-neutral-600">
                  {item.description}
                </p>
              </div>
            ))}
            <div className="pt-2 font-bold">
              <div className="flex justify-between items-center">
                <span>Total Required:</span>
                <NearTokenAmount amount={totalDeposit} />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <InfoIcon size={14} className="opacity-60" />
    </TooltipWithTap>
  );
};
