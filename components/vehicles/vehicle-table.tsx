"use client";

import type { VehicleListItem } from "@/lib/types";
import {
  formatDate,
  formatMileage,
  getDeadlineUrgency,
} from "@/lib/vehicles/utils";
import { Badge } from "@/components/ui/badge";
import { VehicleStatusBadge } from "@/components/vehicles/vehicle-status-badge";

interface VehicleTableProps {
  vehicles: VehicleListItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function VehiclePhoto({ photoUrl }: { photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <div className="h-10 w-14 overflow-hidden rounded-lg border border-border bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-border bg-background text-muted">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 0 0-.244-3.716 3.05 3.05 0 0 0-2.12-2.136 47.664 47.664 0 0 0-8.838 0 3.05 3.05 0 0 0-2.12 2.136 49.903 49.903 0 0 0-.244 3.716c-.039.62.469 1.124 1.09 1.124H21" />
      </svg>
    </div>
  );
}

function DeadlineCell({
  deadline,
}: {
  deadline: VehicleListItem["nextDeadline"];
}) {
  if (!deadline) {
    return <span className="text-sm text-muted">—</span>;
  }

  const urgency = getDeadlineUrgency(deadline.daysRemaining);
  const variant =
    urgency === "danger" ? "danger" : urgency === "warning" ? "warning" : "default";

  return (
    <div>
      <p className="text-sm font-medium">{deadline.type}</p>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="text-xs text-muted">{formatDate(deadline.date)}</span>
        <Badge variant={variant}>
          {deadline.daysRemaining <= 0
            ? "Overdue"
            : `${deadline.daysRemaining}d`}
        </Badge>
      </div>
    </div>
  );
}

export function VehicleTable({ vehicles, onEdit, onDelete }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm">
        <svg className="mx-auto h-12 w-12 text-muted/40" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 0 0-.244-3.716 3.05 3.05 0 0 0-2.12-2.136 47.664 47.664 0 0 0-8.838 0 3.05 3.05 0 0 0-2.12 2.136 49.903 49.903 0 0 0-.244 3.716c-.039.62.469 1.124 1.09 1.124H21" />
        </svg>
        <p className="mt-4 text-sm font-medium">No vehicles found</p>
        <p className="mt-1 text-sm text-muted">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Photo
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                License Plate
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Brand
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Model
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Current KM
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Status
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Next Deadline
              </th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="transition-colors hover:bg-background/40"
              >
                <td className="px-4 py-3">
                  <VehiclePhoto photoUrl={vehicle.photoUrl} />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-semibold tracking-wide">
                    {vehicle.licensePlate}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{vehicle.brand}</td>
                <td className="px-4 py-3 text-sm">{vehicle.model}</td>
                <td className="px-4 py-3 text-sm tabular-nums">
                  {formatMileage(vehicle.currentMileage)}
                </td>
                <td className="px-4 py-3">
                  <VehicleStatusBadge status={vehicle.status} />
                </td>
                <td className="px-4 py-3">
                  <DeadlineCell deadline={vehicle.nextDeadline} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(vehicle.id)}
                      aria-label={`Edit ${vehicle.licensePlate}`}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
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
