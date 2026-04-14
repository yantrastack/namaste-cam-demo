import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "info"
  | "primary";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  /** `sm` matches existing compact chips; `md` is larger for toolbar-style controls. */
  size?: "sm" | "md";
};

const tones: Record<BadgeTone, string> = {
  success: "bg-green-50 text-green-600 ring-1 ring-green-100",
  warning: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  error: "bg-red-50 text-red-600 ring-1 ring-red-100",
  /** Ring matches other tones so mixed rows align to the same height */
  neutral: "bg-stone-100 text-stone-600 ring-1 ring-stone-200/80",
  info: "bg-secondary-container text-on-secondary-container ring-1 ring-secondary-fixed-dim/40",
  primary:
    "bg-primary text-on-primary ring-1 ring-outline-variant/20 shadow-md shadow-primary-soft",
};

const sizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "min-h-6 px-3 py-1 text-xs",
  md: "min-h-9 px-5 py-2 text-sm",
};

export function Badge({
  className,
  tone = "neutral",
  size = "sm",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold uppercase tracking-widest leading-none",
        sizes[size],
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
