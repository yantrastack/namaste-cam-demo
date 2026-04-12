"use client";

import { createContext, useContext, useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export type TabsProps = {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
};

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const baseId = useId();
  const [value, setValue] = useState(defaultValue);
  const memo = useMemo(
    () => ({ value, setValue, baseId }),
    [value, baseId],
  );

  return (
    <TabsContext.Provider value={memo}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export type TabListProps = {
  children: React.ReactNode;
  className?: string;
};

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn("flex flex-wrap gap-2 border-b border-outline-variant/20 pb-2", className)}
    >
      {children}
    </div>
  );
}

export type TabTriggerProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

export function TabTrigger({ value, children, className }: TabTriggerProps) {
  const { value: active, setValue, baseId } = useTabsContext();
  const selected = active === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-bold transition-colors",
        selected
          ? "bg-primary text-on-primary shadow-primary-soft shadow-md"
          : "bg-surface-container-high/60 text-stone-600 hover:bg-surface-container-high",
        className,
      )}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
}

export type TabPanelProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { value: active, baseId } = useTabsContext();
  if (active !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className={cn("pt-4", className)}
    >
      {children}
    </div>
  );
}
