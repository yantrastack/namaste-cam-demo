"use client";

import { cn } from "@/lib/cn";
import { type ReactNode } from "react";

export type TooltipProps = {
  /** Shown on hover / focus (keep concise for small hit targets). */
  content: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Lightweight tooltip (no extra deps). Uses hover + keyboard focus on the trigger.
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg px-3 py-2 text-left text-xs font-medium leading-snug text-on-surface shadow-primary-soft",
          "bg-surface-container-highest ring-1 ring-outline-variant/25",
          "opacity-0 transition-opacity duration-150",
          "group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
        )}
      >
        {content}
      </span>
    </span>
  );
}
