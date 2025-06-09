"use client";

import { memo, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectionSliderProps {
  apy: number; // Annual percentage yield as decimal (e.g., 0.0599 for 5.99%)
  startingAmount: number;
  className?: string;
  onProjectionChange?: (projection: { amount: number; years: number }) => void;
}

const timeLabels = [
  "Today",
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
];

export const ProjectionSlider = memo(
  ({
    apy,
    startingAmount,
    className,
    onProjectionChange,
  }: ProjectionSliderProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const calculateProjection = useCallback(
      (years: number) => {
        if (years === 0) return startingAmount;
        return Math.round(startingAmount * Math.pow(1 + apy, years));
      },
      [apy, startingAmount]
    );

    const handleSliderChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(event.target.value);
        setSelectedIndex(index);
        const projection = {
          amount: calculateProjection(index),
          years: index,
        };
        onProjectionChange?.(projection);
      },
      [calculateProjection, onProjectionChange]
    );

    const currentProjection = calculateProjection(selectedIndex);

    return (
      <div className={cn("w-full max-w-4xl mx-auto", className)}>
        <div className="mb-8 text-center">
          <h3 className="text-lg font-medium text-primary mb-2">
            Amount of veNEAR tokens you could be earning at{" "}
            {(apy * 100).toFixed(2)}% APY
          </h3>
          <div className="text-6xl font-bold text-primary mb-8">
            {currentProjection.toLocaleString()}
          </div>
        </div>

        <div className="relative">
          {/* Slider Track */}
          <div className="relative h-2 bg-gray-200 rounded-full mb-6">
            <div
              className="absolute h-2 rounded-full transition-all duration-300"
              style={{
                background: "#00E391",
                width: `${(selectedIndex / (timeLabels.length - 1)) * 100}%`,
              }}
            />

            {/* Slider Handle */}
            <div
              className="absolute w-6 h-6 bg-gray-800 rounded-full border-4 border-white shadow-lg transform -translate-y-2 transition-all duration-300"
              style={{
                left: `calc(${(selectedIndex / (timeLabels.length - 1)) * 100}% - 12px)`,
              }}
            />
          </div>

          {/* Hidden Range Input */}
          <input
            type="range"
            min="0"
            max={timeLabels.length - 1}
            value={selectedIndex}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Time Labels */}
          <div className="flex justify-between text-sm text-primary font-medium">
            {timeLabels.map((label, index) => (
              <div
                key={label}
                className={cn(
                  "flex flex-col items-center transition-colors duration-200",
                  index <= selectedIndex ? "text-primary" : "text-gray-400"
                )}
              >
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ProjectionSlider.displayName = "ProjectionSlider";
