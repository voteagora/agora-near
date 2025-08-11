import { Button } from "@/components/ui/button";
import { AlertTriangle, Construction } from "lucide-react";

type MaintenanceDialogProps = {
  closeDialog: () => void;
};

export function MaintenanceDialog({ closeDialog }: MaintenanceDialogProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[600px] px-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full">
          <Construction className="w-10 h-10 text-amber-600" />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Maintenance in Progress
          </h2>

          <p className="text-gray-600 leading-relaxed">
            We are currently performing maintenance on our smart contracts and
            will be redeploying them soon. Locking functionality is temporarily
            disabled during this process.
          </p>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 text-left">
              We apologize for any inconvenience and will restore functionality
              as soon as possible.
            </p>
          </div>
        </div>

        <Button onClick={closeDialog} className="w-full">
          Got it
        </Button>
      </div>
    </div>
  );
}
