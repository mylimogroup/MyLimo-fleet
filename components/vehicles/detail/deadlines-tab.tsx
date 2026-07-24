"use client";

import type { Vehicle } from "@/lib/types";
import { computeAllDeadlines, urgencyBadgeVariant } from "@/lib/vehicles/deadlines";
import { formatDate, formatMileage } from "@/lib/vehicles/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface DeadlinesTabProps {
  vehicle: Vehicle;
}

function urgencyLabel(urgency: string) {
  if (urgency === "overdue") return "Overdue";
  if (urgency === "urgent") return "Urgent";
  if (urgency === "approaching") return "Approaching";
  return "Normal";
}

export function DeadlinesTab({ vehicle }: DeadlinesTabProps) {
  const deadlines = computeAllDeadlines(vehicle);

  if (deadlines.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
        title="No upcoming deadlines"
        description="Administrative and maintenance deadlines will appear here"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background/50">
            {[
              "Category",
              "Type",
              "Due Date",
              "Target Mileage",
              "Remaining",
              "Status",
            ].map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {deadlines.map((deadline) => (
            <tr key={deadline.id} className="hover:bg-background/40">
              <td className="px-4 py-3 font-medium">{deadline.label}</td>
              <td className="px-4 py-3 text-muted">
                {deadline.isAdministrative ? "Administrative" : "Maintenance"}
              </td>
              <td className="px-4 py-3">
                {deadline.dueDate ? formatDate(deadline.dueDate) : "—"}
              </td>
              <td className="px-4 py-3 tabular-nums">
                {deadline.targetMileage !== null
                  ? formatMileage(deadline.targetMileage)
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="space-y-0.5 text-xs">
                  {deadline.daysRemaining !== null && (
                    <p>
                      {deadline.daysRemaining <= 0
                        ? "Date overdue"
                        : `${deadline.daysRemaining} days`}
                    </p>
                  )}
                  {deadline.remainingKm !== null && (
                    <p className="tabular-nums">
                      {deadline.remainingKm <= 0
                        ? "Mileage reached"
                        : `${deadline.remainingKm.toLocaleString("it-IT")} km`}
                    </p>
                  )}
                  {deadline.daysRemaining === null &&
                    deadline.remainingKm === null &&
                    "—"}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={urgencyBadgeVariant(deadline.urgency)}>
                  {urgencyLabel(deadline.urgency)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
