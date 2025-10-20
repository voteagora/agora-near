import TokenAmount from "@/components/shared/TokenAmount";
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
        <div className="max-w-[350px] flex flex-col text-left p-3">
          <div className="flex flex-col mb-4">
            <h4 className="text-lg font-bold">{title}</h4>
            <div className="border-b border-neutral-200 pb-4">
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="space-y-4">
            {lineItems.map((item) => (
              <div className="pb-4" key={item.title}>
                <div className="flex justify-between font-bold items-center">
                  <span>{item.title}</span>
                  <TokenAmount amount={item.amount} />
                </div>
                <p className="text-sm mt-1 text-neutral-600">
                  {item.description}
                </p>
              </div>
            ))}
            <div className="font-bold">
              <div className="flex justify-between items-center">
                <span>Total:</span>
                <TokenAmount amount={totalDeposit} />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <InfoIcon size={14} />
    </TooltipWithTap>
  );
};
