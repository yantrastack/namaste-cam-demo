import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "warning" | "error" | "neutral" | "info";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  success: "bg-green-50 text-green-600 ring-1 ring-green-100",
  warning: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  error: "bg-red-50 text-red-600 ring-1 ring-red-100",
  /** Ring matches other tones so mixed rows align to the same height */
  neutral: "bg-stone-100 text-stone-600 ring-1 ring-stone-200/80",
  info: "bg-secondary-container text-on-secondary-container ring-1 ring-secondary-fixed-dim/40",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center justify-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest leading-none",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
