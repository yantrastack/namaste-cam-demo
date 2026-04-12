import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none rounded-full";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary shadow-md shadow-primary-soft hover:bg-primary/90",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
  outline:
    "border-2 border-primary text-primary hover:bg-primary/5 bg-transparent",
  ghost: "bg-transparent text-stone-600 hover:bg-stone-100",
  danger:
    "bg-error text-on-error shadow-md hover:bg-error/90 shadow-[0_8px_24px_-6px_rgb(186_26_26_/_0.22)]",
};

const sizes: Record<ButtonSize, string> = {
  lg: "px-8 py-4 text-base",
  md: "px-6 py-3 text-base",
  sm: "px-4 py-2 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);
