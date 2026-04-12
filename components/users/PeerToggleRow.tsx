"use client";

import { cn } from "@/lib/cn";

export function PeerToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-surface p-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-on-surface">{title}</p>
        <p className="text-[11px] text-stone-400">{description}</p>
      </div>
      <span className="relative h-6 w-11 shrink-0">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-stone-200 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30",
            "after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:border-white",
          )}
        />
      </span>
    </label>
  );
}
