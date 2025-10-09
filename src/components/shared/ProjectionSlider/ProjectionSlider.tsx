"use client";

import { memo, useCallback, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import TokenAmount from "../TokenAmount";
import { utils } from "near-api-js";

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

const MAX_YEARS = timeLabels.length - 1;

export const ProjectionSlider = memo(
  ({
    apy,
    startingAmount,
    className,
    onProjectionChange,
  }: ProjectionSliderProps) => {
    const [selectedValue, setSelectedValue] = useState(0); // Now supports decimal values
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLInputElement>(null);

    const calculateProjection = useCallback(
      (years: number) => {
        if (years === 0) return startingAmount;
        return startingAmount * Math.pow(1 + apy, years);
      },
      [apy, startingAmount]
    );

    const handleSliderChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setSelectedValue(value);

        const projection = {
          amount: calculateProjection(value),
          years: value,
        };
        onProjectionChange?.(projection);
      },
      [calculateProjection, onProjectionChange]
    );

    const handleMouseDown = useCallback(() => {
      setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const currentProjection = calculateProjection(selectedValue);
    const progressPercentage = (selectedValue / MAX_YEARS) * 100;
    const shouldShowDecimals = startingAmount < 100;

    return (
      <div className={cn("w-full max-w-4xl mx-auto", className)}>
        <div className="mb-8 text-center">
          <h3 className="text-lg font-medium text-primary mb-2">
            Amount of veNEAR tokens you could be earning at{" "}
            {(apy * 100).toFixed(2)}% VPG
          </h3>
          <div className="text-6xl font-bold text-primary mb-8 tabular-nums">
            <TokenAmount
              amount={
                utils.format.parseNearAmount(currentProjection.toString()) ??
                "0"
              }
              compact={false}
              hideCurrency={true}
              minimumFractionDigits={shouldShowDecimals ? 4 : 0}
              maximumSignificantDigits={shouldShowDecimals ? 4 : 0}
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative h-2 bg-gray-200 rounded-full mb-6">
            <div
              className={cn(
                "absolute h-2 rounded-full",
                isDragging ? "transition-none" : "transition-all duration-150"
              )}
              style={{
                background: "#00E391",
                width: `${progressPercentage}%`,
              }}
            />

            {/* Slider Handle */}
            <div
              className={cn(
                "absolute w-6 h-6 bg-gray-800 rounded-full border-4 border-white shadow-lg transform -translate-y-2",
                isDragging
                  ? "transition-none scale-110"
                  : "transition-all duration-150"
              )}
              style={{
                left: `calc(${progressPercentage}% - 12px)`,
              }}
            />
          </div>

          {/* Hidden Range Input */}
          <input
            ref={sliderRef}
            type="range"
            min="0"
            max={MAX_YEARS}
            step="0.01" // Allow fine-grained control
            value={selectedValue}
            onChange={handleSliderChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Time Labels */}
          <div className="flex justify-between text-sm text-primary font-medium">
            {timeLabels.map((label, index) => {
              const isActive =
                selectedValue - index >= 0 && selectedValue <= index + 0.1;

              return (
                <div
                  key={label}
                  className={cn(
                    "flex flex-col items-center transition-colors duration-200",
                    isActive ? "text-primary" : "text-gray-400",
                    isActive && isDragging ? "scale-110 font-bold" : ""
                  )}
                >
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

ProjectionSlider.displayName = "ProjectionSlider";
