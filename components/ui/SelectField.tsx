import type { SelectHTMLAttributes } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function SelectField({
  label,
  hint,
  error,
  className,
  id,
  children,
  ...props
}: SelectFieldProps) {
  const inputId = id ?? props.name;
  const state = error ? "error" : "default";

  const fieldClass = cn(
    "box-border min-h-12 w-full appearance-none rounded-xl border-none bg-surface py-3 pl-4 pr-10 font-body text-sm font-semibold text-on-surface outline-none transition-all",
    state === "default" && "ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary",
    state === "error" && "bg-red-50 ring-2 ring-red-500/30 focus:ring-2 focus:ring-red-500/40",
    className,
  );

  return (
    <div className="space-y-2">
      {inputId ? (
        <label htmlFor={inputId} className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary">
          {label}
        </label>
      ) : (
        <p className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary">{label}</p>
      )}
      <div className="relative">
        <select id={inputId} className={fieldClass} {...props}>
          {children}
        </select>
        <MaterialIcon
          name="expand_more"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
        />
      </div>
      {error ? (
        <p className="ml-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="ml-1 text-xs text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}
