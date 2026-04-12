"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  /** Called when the user confirms. May be async; modal shows a busy state until it settles. */
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
};

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  className,
}: DeleteConfirmModalProps) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) setPending(false);
  }, [open]);

  const handleClose = () => {
    if (pending) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (pending) return;
    setPending(true);
    try {
      await Promise.resolve(onConfirm());
      onClose();
    } catch {
      /* Caller may throw; keep dialog open */
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className={cn(
        "max-w-lg! rounded-2xl! p-6! w-full shadow-xl ring-1 ring-outline-variant/15 transition-[box-shadow,transform] duration-200 ease-out",
        className,
      )}
    >
      <div className="flex gap-3.5 sm:gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-error-container/45 text-error ring-1 ring-error/15 transition-transform duration-200 ease-out"
          aria-hidden
        >
          <MaterialIcon name="delete_forever" className="text-[1.375rem]! leading-none" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-headline text-lg font-bold leading-snug tracking-tight text-on-surface">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-outline-variant/10 pt-5 sm:flex-row sm:justify-end sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-outline-variant/35 sm:w-auto sm:min-w-26"
          onClick={handleClose}
          disabled={pending}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          className="w-full sm:w-auto sm:min-w-26"
          onClick={handleConfirm}
          disabled={pending}
        >
          {pending ? "Deleting…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
