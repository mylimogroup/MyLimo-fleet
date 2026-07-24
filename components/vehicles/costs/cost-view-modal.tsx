"use client";

import type { VehicleCostEntry } from "@/lib/types";
import {
  formatCostAmount,
  getCostCategoryLabel,
} from "@/lib/vehicles/costs";
import { formatDate, formatMileage } from "@/lib/vehicles/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface CostViewModalProps {
  open: boolean;
  onClose: () => void;
  cost: VehicleCostEntry | null;
  onEdit?: () => void;
}

export function CostViewModal({
  open,
  onClose,
  cost,
  onEdit,
}: CostViewModalProps) {
  if (!cost) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cost Details"
      subtitle={getCostCategoryLabel(cost.category)}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              Edit
            </Button>
          )}
        </>
      }
    >
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted">Date</dt>
          <dd className="font-medium">{formatDate(cost.date)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Category</dt>
          <dd className="font-medium">{getCostCategoryLabel(cost.category)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-muted">Description</dt>
          <dd className="font-medium">{cost.description}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-muted">Supplier / Workshop</dt>
          <dd className="font-medium">{cost.supplier || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Mileage</dt>
          <dd className="font-medium">
            {cost.mileage !== null ? formatMileage(cost.mileage) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Net</dt>
          <dd className="font-medium tabular-nums">
            {formatCostAmount(cost.netAmount)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">VAT</dt>
          <dd className="font-medium tabular-nums">
            {formatCostAmount(cost.vatAmount)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Total</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {formatCostAmount(cost.totalAmount)}
          </dd>
        </div>
        {cost.notes && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted">Notes</dt>
            <dd className="mt-1 rounded-lg bg-background px-3 py-2 text-muted">
              {cost.notes}
            </dd>
          </div>
        )}
        {cost.invoicePdfUrl && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted">Invoice / Receipt</dt>
            <dd className="mt-1">
              <a
                href={cost.invoicePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {cost.invoicePdfName ?? "View PDF"}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </Modal>
  );
}
