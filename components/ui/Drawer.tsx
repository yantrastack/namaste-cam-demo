"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
  position?: "left" | "right";
  /** When true, overlay is limited to the /user mobile column (matches `user-app-fixed-frame`). */
  userAppFrame?: boolean;
};

export function Drawer({
  open,
  onClose,
  children,
  className,
  position = "left",
  userAppFrame = false,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed z-[900] flex",
        userAppFrame
          ? "user-app-fixed-frame top-0 bottom-0"
          : "inset-0",
      )}
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-[901] h-full w-80 max-w-[85vw] bg-surface-container-lowest shadow-2xl transition-transform duration-300 ease-out",
          position === "right" ? "ml-auto" : "mr-auto",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
