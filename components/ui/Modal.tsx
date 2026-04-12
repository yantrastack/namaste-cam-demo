"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-[101] w-full max-w-sm rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-xl",
          className,
        )}
      >
        {title ? (
          <h3 className="mb-2 text-2xl font-bold text-on-surface">{title}</h3>
        ) : null}
        {description ? (
          <p className="mb-6 leading-relaxed text-stone-500">{description}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
