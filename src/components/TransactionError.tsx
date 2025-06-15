import { XIcon } from "lucide-react";
import { memo, useCallback } from "react";
import { UpdatedButton } from "./Button";

type TransactionErrorProps = {
  message: string;
  onRetry: () => void;
  onGoBack?: () => void;
};

export const TransactionError = memo<TransactionErrorProps>(
  ({ message, onRetry, onGoBack }) => {
    const handleRetry = useCallback(() => {
      onRetry();
    }, [onRetry]);

    return (
      <div className="flex w-full h-full flex-col items-center rounded-lg">
        <div className="flex-1 flex w-full flex-col justify-center items-center gap-4">
          <div className="w-[52px] h-[52px] border-4 border-[#FF7966] rounded-full flex items-center justify-center">
            <XIcon className="w-8 h-8 text-[#FF7966]" />
          </div>
          <h2 className="text-4xl font-semibold text-[#FF7966] text-center">
            Transaction Error
          </h2>
          <p className="text-center font-normal text-black text-xl">
            {message}
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-2 justify-end w-full">
          <UpdatedButton
            className="w-full"
            variant="rounded"
            onClick={handleRetry}
          >
            Try again
          </UpdatedButton>
          {onGoBack && (
            <UpdatedButton
              className="w-full border-none"
              type="link"
              onClick={onGoBack}
            >
              Go back
            </UpdatedButton>
          )}
        </div>
      </div>
    );
  }
);

TransactionError.displayName = "TransactionError";
