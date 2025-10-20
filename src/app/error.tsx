"use client";

import { useEffect } from "react";
import ResourceNotFound from "@/components/shared/ResourceNotFound/ResourceNotFound";
import { UpdatedButton } from "@/components/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: integrate logger if available
    // console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <ResourceNotFound
        message="Something went wrong."
        ctaHref="/"
        ctaLabel="Go home"
        decorated
        showCTA
      />
      <div className="mt-4">
        <UpdatedButton
          type="secondary"
          variant="rounded"
          onClick={() => reset()}
        >
          Retry
        </UpdatedButton>
      </div>
    </div>
  );
}
