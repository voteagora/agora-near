"use client";

export default function InputBox({
  placeholder,
  onChange,
  value,
  error,
  ...props
}: {
  placeholder: string;
  value: any;
  onChange: (next: any) => void;
  error?: boolean;
  [key: string]: any;
}) {
  return (
    <input
      className={`w-full py-2 px-4 rounded-md text-base border ${error ? "border-negative" : "border-line"} bg-neutral`}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onWheel={(e) => e.currentTarget.blur()}
      {...props}
    />
  );
}
