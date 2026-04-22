"use client";

import { cn } from "@/lib/cn";
import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";

export type SwitchProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "aria-checked" | "onClick"
>;

export function Switch({
  checked: controlledChecked,
  onCheckedChange,
  disabled = false,
  className,
  children,
  ...buttonProps
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(false);
  const checked = controlledChecked ?? uncontrolledChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newChecked = !checked;
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    } else {
      setUncontrolledChecked(newChecked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleToggle}
      {...buttonProps}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        checked ? "bg-primary" : "bg-surface-container-high",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform",
          checked ? "translate-x-6" : "translate-x-0.5",
        )}
      />
      {children}
    </button>
  );
}
