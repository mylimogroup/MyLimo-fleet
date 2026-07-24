"use client";

import type { VehicleCostEntry } from "@/lib/types";
import {
  formatCostAmount,
  getCostCategoryLabel,
  sortCostsNewestFirst,
} from "@/lib/vehicles/costs";
import { formatDate, formatMileage } from "@/lib/vehicles/utils";
import { EmptyState } from "@/components/ui/empty-state";

interface CostTableProps {
  costs: VehicleCostEntry[];
  onEdit: (cost: VehicleCostEntry) => void;
  onDelete: (cost: VehicleCostEntry) => void;
  onView?: (cost: VehicleCostEntry) => void;
}

const ACTIONS_HEADER_CLASS =
  "sticky right-0 z-20 min-w-[140px] bg-background/95 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted shadow-[-10px_0_12px_-10px_rgba(15,23,42,0.12)]";

const ACTIONS_CELL_CLASS =
  "sticky right-0 z-10 min-w-[140px] bg-card px-4 py-3 shadow-[-10px_0_12px_-10px_rgba(15,23,42,0.12)] group-hover:bg-background/40";

function CostRowActions({
  cost,
  onEdit,
  onDelete,
  onView,
  className = "",
}: {
  cost: VehicleCostEntry;
  onEdit: (cost: VehicleCostEntry) => void;
  onDelete: (cost: VehicleCostEntry) => void;
  onView?: (cost: VehicleCostEntry) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {onView && (
        <button
          type="button"
          onClick={() => onView(cost)}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted hover:bg-background hover:text-foreground"
        >
          View
        </button>
      )}
      <button
        type="button"
        onClick={() => onEdit(cost)}
        className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted hover:bg-background hover:text-foreground"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(cost)}
        className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted hover:bg-red-50 hover:text-red-600"
      >
        Delete
      </button>
    </div>
  );
}

function MobileCostField({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className={`mt-0.5 text-sm ${valueClassName}`}>{value}</dd>
    </div>
  );
}

export function CostTable({
  costs,
  onEdit,
  onDelete,
  onView,
}: CostTableProps) {
  const rows = sortCostsNewestFirst(costs);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25m2.25 0v.75c0 .621-.504 1.125-1.125 1.125H21m-2.25 0h.008v.008H18.75v-.008Zm0 3.75h.008v.008H18.75V8.25Zm-3.75 0h.008v.008H15V8.25Zm-3.75 0h.008v.008H11.25V8.25Zm-3.75 0h.008v.008H7.5V8.25Zm-3.75 0h.008v.008H3.75V8.25Z" />
          </svg>
        }
        title="No cost records"
        description="Add the first operating cost for this vehicle"
      />
    );
  }

  const columns = [
    "Date",
    "Category",
    "Description",
    "Supplier",
    "Mileage",
    "Net",
    "VAT",
    "Total",
    "Actions",
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="divide-y divide-border md:hidden">
        {rows.map((cost) => (
          <article key={cost.id} className="space-y-3 p-4">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MobileCostField label="Date" value={formatDate(cost.date)} />
              <MobileCostField
                label="Category"
                value={getCostCategoryLabel(cost.category)}
              />
              <MobileCostField
                label="Description"
                value={cost.description}
                valueClassName="font-medium"
              />
              <MobileCostField
                label="Supplier / Workshop"
                value={cost.supplier || "—"}
              />
              <MobileCostField
                label="Mileage"
                value={
                  cost.mileage !== null ? formatMileage(cost.mileage) : "—"
                }
                valueClassName="tabular-nums"
              />
              <MobileCostField
                label="Net"
                value={formatCostAmount(cost.netAmount)}
                valueClassName="tabular-nums"
              />
              <MobileCostField
                label="VAT"
                value={formatCostAmount(cost.vatAmount)}
                valueClassName="tabular-nums"
              />
              <MobileCostField
                label="Total"
                value={formatCostAmount(cost.totalAmount)}
                valueClassName="font-semibold tabular-nums"
              />
            </dl>
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                Actions
              </p>
              <CostRowActions
                cost={cost}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {columns.map((col) => (
                <th
                  key={col}
                  className={
                    col === "Actions"
                      ? ACTIONS_HEADER_CLASS
                      : `px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${
                          col === "Net" || col === "VAT" || col === "Total"
                            ? "text-right"
                            : "text-left"
                        }`
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((cost) => (
              <tr key={cost.id} className="group hover:bg-background/40">
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(cost.date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getCostCategoryLabel(cost.category)}
                </td>
                <td className="max-w-[180px] truncate px-4 py-3">
                  {cost.description}
                </td>
                <td className="max-w-[140px] truncate px-4 py-3">
                  {cost.supplier || "—"}
                </td>
                <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                  {cost.mileage !== null ? formatMileage(cost.mileage) : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                  {formatCostAmount(cost.netAmount)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                  {formatCostAmount(cost.vatAmount)}
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap">
                  {formatCostAmount(cost.totalAmount)}
                </td>
                <td className={ACTIONS_CELL_CLASS}>
                  <CostRowActions
                    cost={cost}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    className="justify-end whitespace-nowrap"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
