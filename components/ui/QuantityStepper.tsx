"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";

export type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  className?: string;
};

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled,
  className,
}: QuantityStepperProps) {
  const dec = () => {
    if (disabled) return;
    onChange(Math.max(min, value - 1));
  };
  const inc = () => {
    if (disabled) return;
    onChange(Math.min(max, value + 1));
  };

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full bg-surface-container-low ring-1 ring-outline-variant/20",
        className,
      )}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-secondary transition-colors hover:bg-surface-container-high hover:text-primary disabled:opacity-40"
        onClick={dec}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <MaterialIcon name="remove" className="text-lg" />
      </button>
      <span className="min-w-8 px-1 text-center text-sm font-bold tabular-nums text-on-surface">
        {value}
      </span>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-secondary transition-colors hover:bg-surface-container-high hover:text-primary disabled:opacity-40"
        onClick={inc}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <MaterialIcon name="add" className="text-lg" />
      </button>
    </div>
  );
}
