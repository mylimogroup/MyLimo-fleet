"use client";

import type { VehicleCostEntry } from "@/lib/types";
import {
  formatCostAmount,
  getCostCategoryLabel,
} from "@/lib/vehicles/costs";
import { formatDate } from "@/lib/vehicles/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface CostDeleteModalProps {
  open: boolean;
  cost: VehicleCostEntry | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function CostDeleteModal({
  open,
  cost,
  onClose,
  onConfirm,
}: CostDeleteModalProps) {
  if (!cost) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Cost"
      subtitle="This action cannot be undone"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Cost
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">
        Are you sure you want to delete this cost record?
      </p>
      <dl className="mt-4 space-y-2 rounded-lg border border-border bg-background/50 px-4 py-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Date</dt>
          <dd className="font-medium">{formatDate(cost.date)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Category</dt>
          <dd className="font-medium">{getCostCategoryLabel(cost.category)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Description</dt>
          <dd className="max-w-[240px] truncate text-right font-medium">
            {cost.description}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Total</dt>
          <dd className="font-semibold tabular-nums">
            {formatCostAmount(cost.totalAmount)}
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
