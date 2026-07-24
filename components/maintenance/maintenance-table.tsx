"use client";

import Link from "next/link";
import type { MaintenanceAlert, MaintenanceListItem } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  formatMileage,
  getCategoryLabel,
} from "@/lib/maintenance/utils";
import { AlertBadges } from "@/components/ui/alert-badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ExpirationCell } from "@/components/ui/expiration-cell";
import { MaintenanceStatusBadge } from "@/components/maintenance/maintenance-status-badge";

interface MaintenanceTableProps {
  records: MaintenanceListItem[];
  alerts: MaintenanceAlert[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MaintenanceTable({
  records,
  alerts,
  onEdit,
  onDelete,
}: MaintenanceTableProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
        }
        title="No maintenance records found"
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {[
                "Vehicle",
                "Plate",
                "Type",
                "Status",
                "Workshop",
                "Scheduled",
                "Completed",
                "Mileage",
                "Est. Cost",
                "Actual",
                "Next Service",
                "Alerts",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className={`px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted ${
                    col === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record) => {
              const rowAlerts = alerts.filter(
                (a) => a.vehicleId === record.vehicleId
              );

              return (
                <tr
                  key={record.id}
                  className="transition-colors hover:bg-background/40"
                >
                  <td className="px-3 py-3">
                    <Link
                      href={`/maintenance/${record.vehicleId}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {record.vehicleBrand} {record.vehicleModel}
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-mono text-sm">
                    {record.licensePlate}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {getCategoryLabel(record.category)}
                  </td>
                  <td className="px-3 py-3">
                    <MaintenanceStatusBadge status={record.status} />
                  </td>
                  <td className="px-3 py-3 text-sm">{record.workshop}</td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap">
                    {formatDate(record.scheduledDate)}
                  </td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap">
                    {record.completedDate
                      ? formatDate(record.completedDate)
                      : "—"}
                  </td>
                  <td className="px-3 py-3 text-sm tabular-nums whitespace-nowrap">
                    {formatMileage(record.mileage)}
                  </td>
                  <td className="px-3 py-3 text-sm tabular-nums whitespace-nowrap">
                    {formatCurrency(record.estimatedCost)}
                  </td>
                  <td className="px-3 py-3 text-sm tabular-nums whitespace-nowrap">
                    {record.totalCost > 0
                      ? formatCurrency(record.totalCost)
                      : "—"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {record.nextServiceDate ? (
                      <ExpirationCell date={record.nextServiceDate} />
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <AlertBadges alerts={rowAlerts} max={2} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/maintenance/${record.vehicleId}`}
                        aria-label="View vehicle timeline"
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(record.id)}
                        aria-label="Edit record"
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(record.id)}
                        aria-label="Delete record"
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
