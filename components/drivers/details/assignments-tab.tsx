"use client";

import type { Driver } from "@/lib/types";
import { formatDate } from "@/lib/drivers/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

interface AssignmentsTabProps {
  driver: Driver;
}

export function AssignmentsTab({ driver }: AssignmentsTabProps) {
  if (driver.assignments.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 0 0-.244-3.716 3.05 3.05 0 0 0-2.12-2.136 47.664 47.664 0 0 0-8.838 0 3.05 3.05 0 0 0-2.12 2.136 49.903 49.903 0 0 0-.244 3.716c-.039.62.469 1.124 1.09 1.124H21" />
          </svg>
        }
        title="No vehicle assignments"
        description="This driver has not been assigned to any vehicle"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Vehicle
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Plate
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Start Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                End Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {driver.assignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-background/40">
                <td className="px-5 py-3 font-medium">
                  {assignment.vehicleBrand} {assignment.vehicleModel}
                </td>
                <td className="px-5 py-3 font-mono">
                  {assignment.vehiclePlate}
                </td>
                <td className="px-5 py-3">
                  {formatDate(assignment.startDate)}
                </td>
                <td className="px-5 py-3">
                  {assignment.endDate ? formatDate(assignment.endDate) : "—"}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={assignment.endDate ? "default" : "success"}>
                    {assignment.endDate ? "Ended" : "Active"}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-muted">
                  {assignment.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
