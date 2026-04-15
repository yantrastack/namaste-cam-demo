"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";

const items = [
  { href: "#typography", label: "Typography", icon: "text_fields" },
  { href: "#buttons", label: "Buttons", icon: "smart_button" },
  { href: "#forms", label: "Forms", icon: "edit_note" },
  { href: "#tables", label: "Tables", icon: "table_chart" },
  { href: "#feedback", label: "Feedback", icon: "announcement" },
  { href: "#project-tokens", label: "Tokens", icon: "palette" },
] as const;

function currentSection() {
  if (typeof window === "undefined") return "typography";
  const h = window.location.hash.replace("#", "");
  return h || "typography";
}

export function DsSideNav() {
  const [active, setActive] = useState("typography");

  useEffect(() => {
    const sync = () => setActive(currentSection());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col gap-2 border-r border-outline-variant/20 bg-surface-container-low py-6 pt-20 md:flex">
      <div className="mb-6 px-8">
        <h3 className="font-body text-lg font-bold text-on-surface">Playground</h3>
        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">
          v1.0.4
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const id = item.href.replace("#", "");
          const isActive = active === id;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "ml-4 flex items-center gap-3 py-3 pl-4 transition-all duration-300 ease-in-out",
                isActive
                  ? "rounded-l-full bg-surface-container-lowest py-3 font-bold text-primary shadow-sm"
                  : "px-8 py-3 text-on-surface-variant hover:bg-surface-container-lowest/70 hover:text-primary",
              )}
            >
              <MaterialIcon name={item.icon} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
