import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  left?: ReactNode;
  /** Compact control (smaller min height, padding, type). Default matches existing screens. */
  controlSize?: "md" | "sm";
};

export function Input({
  label,
  hint,
  error,
  success,
  left,
  className,
  id,
  controlSize = "md",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const state = error ? "error" : success ? "success" : "default";

  const fieldClass = cn(
    "box-border w-full border-none font-body font-semibold text-on-surface outline-none transition-all",
    controlSize === "sm"
      ? "min-h-9 rounded-lg py-2 text-xs"
      : "min-h-12 rounded-xl py-3 text-sm",
    left ? "pl-12 pr-4" : "px-4",
    state === "default" &&
      "bg-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary",
    state === "success" &&
      "bg-green-50 ring-2 ring-green-500/30 focus:ring-2 focus:ring-green-500/40",
    state === "error" &&
      "bg-red-50 ring-2 ring-red-500/30 focus:ring-2 focus:ring-red-500/40",
    className,
  );

  return (
    <div className={label ? "space-y-2" : ""}>
      {label && (
        <>
          {inputId ? (
            <label
              htmlFor={inputId}
              className={cn(
                "ml-1 font-bold text-on-surface",
                controlSize === "sm" ? "text-xs" : "text-sm",
              )}
            >
              {label}
            </label>
          ) : (
            <p
              className={cn(
                "ml-1 font-bold text-on-surface",
                controlSize === "sm" ? "text-xs" : "text-sm",
              )}
            >
              {label}
            </p>
          )}
        </>
      )}
      <div className="relative">
        {left ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {left}
          </span>
        ) : null}
        <input id={inputId} className={fieldClass} {...props} />
      </div>
      {error ? (
        <p className="ml-1 text-xs font-medium text-red-600">{error}</p>
      ) : success ? (
        <p className="ml-1 text-xs font-medium text-green-600">{success}</p>
      ) : hint ? (
        <p className="ml-1 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
}
