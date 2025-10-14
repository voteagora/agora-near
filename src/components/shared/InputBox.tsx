"use client";

import React from "react";

export const InputBox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full py-2 px-4 rounded-md text-base border ${error ? "border-negative" : "border-line"} bg-neutral`}
      onWheel={(e) => e.currentTarget.blur()}
      {...props}
    />
  );
});

InputBox.displayName = "Inputbox";
