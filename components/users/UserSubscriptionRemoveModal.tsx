"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  userName: string;
  planLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function UserSubscriptionRemoveModal({
  open,
  userName,
  planLabel,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Remove subscription?"
      description={
        planLabel
          ? `${userName} will lose access to “${planLabel}” on their account record. You can assign a new plan later.`
          : `Remove the subscription from ${userName}? You can assign a new plan later.`
      }
      className="max-w-md"
    >
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Remove subscription
        </Button>
      </div>
    </Modal>
  );
}
