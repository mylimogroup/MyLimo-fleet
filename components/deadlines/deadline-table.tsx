"use client";

import Link from "next/link";
import type { ComputedDeadline, FleetDeadlineRow } from "@/lib/types";
import {
  canCompleteDeadlineAsMaintenance,
  formatRemaining,
  getTriggerTypeLabel,
} from "@/lib/vehicles/deadlines";
import { formatDate, formatMileage } from "@/lib/vehicles/utils";
import { DeadlinePriorityBadge } from "@/components/deadlines/deadline-priority-badge";
import { EmptyState } from "@/components/ui/empty-state";

type DeadlineRow = ComputedDeadline | FleetDeadlineRow;

function isFleetRow(row: DeadlineRow): row is FleetDeadlineRow {
  return "vehicleId" in row;
}

interface DeadlineTableProps {
  rows: DeadlineRow[];
  showVehicle?: boolean;
  onEdit?: (row: DeadlineRow) => void;
  onDelete?: (row: DeadlineRow) => void;
  onComplete?: (row: DeadlineRow) => void;
}

export function DeadlineTable({
  rows,
  showVehicle = true,
  onEdit,
  onDelete,
  onComplete,
}: DeadlineTableProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
        title="No deadlines found"
        description="Adjust filters or add a new deadline"
      />
    );
  }

  const columns = [
    ...(showVehicle ? ["Vehicle", "Plate"] : []),
    "Deadline Type",
    "Trigger",
    "Due Date",
    "Target KM",
    "Current KM",
    "Remaining",
    "Priority",
    ...(onEdit || onDelete || onComplete ? ["Actions"] : []),
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {columns.map((col) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${
                    col === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={`${isFleetRow(row) ? row.vehicleId : "vehicle"}-${row.id}`} className="hover:bg-background/40">
                {showVehicle && isFleetRow(row) && (
                  <>
                    <td className="px-4 py-3">
                      <Link
                        href={`/vehicles/${row.vehicleId}`}
                        className="font-medium hover:text-primary"
                      >
                        {row.vehicleBrand} {row.vehicleModel}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.licensePlate}
                    </td>
                  </>
                )}
                <td className="px-4 py-3 font-medium">{row.label}</td>
                <td className="px-4 py-3 text-muted">
                  {getTriggerTypeLabel(row.triggerType)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.dueDate ? formatDate(row.dueDate) : "—"}
                </td>
                <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                  {row.targetMileage !== null
                    ? formatMileage(row.targetMileage)
                    : "—"}
                </td>
                <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                  {formatMileage(row.currentMileage)}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums">
                  {formatRemaining(row)}
                </td>
                <td className="px-4 py-3">
                  <DeadlinePriorityBadge urgency={row.urgency} />
                </td>
                {(onEdit || onDelete || onComplete) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {onComplete && canCompleteDeadlineAsMaintenance(row) && (
                        <button
                          type="button"
                          onClick={() => onComplete(row)}
                          className="rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                        >
                          Complete
                        </button>
                      )}
                      {row.isEditable && onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="rounded-lg px-2 py-1.5 text-xs text-muted hover:text-foreground"
                        >
                          Edit
                        </button>
                      )}
                      {row.isEditable && onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="rounded-lg px-2 py-1.5 text-xs text-muted hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                      {!row.isEditable && (
                        <Link
                          href={
                            isFleetRow(row)
                              ? `/vehicles/${row.vehicleId}?tab=documents`
                              : "#"
                          }
                          className="rounded-lg px-2 py-1.5 text-xs text-primary hover:underline"
                        >
                          View doc
                        </Link>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
