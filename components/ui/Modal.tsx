"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Rich heading (e.g. image + title). When set, overrides plain `title`. */
  titleContent?: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
  /** When true, dialog shell has no default padding (layout owns spacing). */
  unpadded?: boolean;
  /** Scrim behind the dialog (defaults to a dim neutral veil). */
  backdropClassName?: string;
};

export function Modal({
  open,
  onClose,
  title,
  titleContent,
  description,
  children,
  className,
  unpadded,
  backdropClassName,
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
        className={cn(
          "absolute inset-0",
          backdropClassName ?? "bg-stone-900/40 backdrop-blur-sm transition-colors duration-200 ease-out",
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-[101] w-full max-w-sm rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-xl",
          !unpadded && "p-8",
          className,
        )}
      >
        {titleContent ? (
          <div className="mb-2">{titleContent}</div>
        ) : title ? (
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
