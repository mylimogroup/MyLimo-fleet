"use client";

import Link from "next/link";
import type { VehicleListItem } from "@/lib/types";
import {
  formatDate,
  formatMileage,
} from "@/lib/vehicles/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface VehicleTableProps {
  vehicles: VehicleListItem[];
  onDelete: (id: string) => void;
}

function DeadlineCell({
  deadline,
}: {
  deadline: VehicleListItem["nextDeadline"];
}) {
  if (!deadline) {
    return <span className="text-sm text-muted">—</span>;
  }

  const variant =
    deadline.urgency === "overdue" || deadline.urgency === "urgent"
      ? "danger"
      : deadline.urgency === "approaching"
        ? "warning"
        : "default";

  return (
    <div>
      <p className="text-sm font-medium">{deadline.label}</p>
      <div className="mt-0.5 flex flex-wrap items-center gap-2">
        {deadline.dueDate && (
          <span className="text-xs text-muted">
            {formatDate(deadline.dueDate)}
          </span>
        )}
        {deadline.targetMileage !== null && (
          <span className="text-xs text-muted tabular-nums">
            {deadline.targetMileage.toLocaleString("it-IT")} km
          </span>
        )}
        <Badge variant={variant}>
          {deadline.urgency === "overdue"
            ? "Overdue"
            : deadline.remainingKm !== null && deadline.remainingKm <= 1000
              ? `${deadline.remainingKm.toLocaleString("it-IT")} km`
              : deadline.daysRemaining !== null
                ? `${deadline.daysRemaining}d`
                : deadline.urgency}
        </Badge>
      </div>
    </div>
  );
}

export function VehicleTable({ vehicles, onDelete }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 0 0-.244-3.716 3.05 3.05 0 0 0-2.12-2.136 47.664 47.664 0 0 0-8.838 0 3.05 3.05 0 0 0-2.12 2.136 49.903 49.903 0 0 0-.244 3.716c-.039.62.469 1.124 1.09 1.124H21" />
          </svg>
        }
        title="No vehicles found"
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {[
                "License Plate",
                "Brand",
                "Model",
                "Version",
                "Current KM",
                "Next Deadline",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted ${
                    col === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="transition-colors hover:bg-background/40"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="font-mono text-sm font-semibold tracking-wide hover:text-primary"
                  >
                    {vehicle.licensePlate}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm">{vehicle.brand}</td>
                <td className="px-4 py-3 text-sm">{vehicle.model}</td>
                <td className="px-4 py-3 text-sm text-muted">
                  {vehicle.version || "—"}
                </td>
                <td className="px-4 py-3 text-sm tabular-nums">
                  {formatMileage(vehicle.currentMileage)}
                </td>
                <td className="px-4 py-3">
                  <DeadlineCell deadline={vehicle.nextDeadline} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      aria-label={`View ${vehicle.licensePlate}`}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(vehicle.id)}
                      aria-label={`Delete ${vehicle.licensePlate}`}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
