import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Textarea({
  label,
  hint,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? props.name;
  const state = error ? "error" : "default";

  const fieldClass = cn(
    "min-h-32 w-full resize-y rounded-xl border-none px-4 py-3 font-body text-sm outline-none transition-all",
    state === "default" &&
      "bg-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary",
    state === "error" &&
      "bg-red-50 ring-2 ring-red-500/30 focus:ring-2 focus:ring-red-500/40",
    className,
  );

  return (
    <div className="space-y-2">
      {inputId ? (
        <label htmlFor={inputId} className="ml-1 text-xs font-extrabold uppercase tracking-widest text-secondary">
          {label}
        </label>
      ) : (
        <p className="ml-1 text-xs font-extrabold uppercase tracking-widest text-secondary">{label}</p>
      )}
      <textarea id={inputId} className={fieldClass} {...props} />
      {error ? (
        <p className="ml-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="ml-1 text-xs text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}
