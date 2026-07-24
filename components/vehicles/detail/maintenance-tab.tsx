"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Vehicle } from "@/lib/types";
import { getMaintenanceRepository } from "@/lib/maintenance/service";
import { computeAllDeadlines, urgencyBadgeVariant } from "@/lib/vehicles/deadlines";
import { formatDate, formatMileage } from "@/lib/vehicles/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MaintenanceTimeline } from "@/components/maintenance/maintenance-timeline";

interface MaintenanceTabProps {
  vehicleId: string;
  vehicle: Vehicle;
}

export function MaintenanceTab({ vehicleId, vehicle }: MaintenanceTabProps) {
  const [records, setRecords] = useState<
    Awaited<ReturnType<ReturnType<typeof getMaintenanceRepository>["listByVehicle"]>>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMaintenanceRepository()
      .listByVehicle(vehicleId)
      .then((data) => {
        if (!cancelled) {
          setRecords(data);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [vehicleId]);

  const upcomingDeadlines = computeAllDeadlines(vehicle).filter(
    (d) => !d.isAdministrative && d.urgency !== "normal"
  );

  if (loading) {
    return <div className="h-32 animate-pulse rounded-xl bg-border" />;
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Upcoming Maintenance
          </h3>
          <Link href={`/maintenance/${vehicleId}`}>
            <Button variant="secondary" size="sm">
              Log Maintenance
            </Button>
          </Link>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <p className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted">
            No upcoming maintenance deadlines for this vehicle.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  {["Type", "Due Date", "Target KM", "Remaining", "Status"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {upcomingDeadlines.map((deadline) => (
                  <tr key={deadline.id} className="hover:bg-background/40">
                    <td className="px-4 py-3 font-medium">{deadline.label}</td>
                    <td className="px-4 py-3">
                      {deadline.dueDate ? formatDate(deadline.dueDate) : "—"}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {deadline.targetMileage !== null
                        ? formatMileage(deadline.targetMileage)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums">
                      {deadline.remainingKm !== null &&
                        `${deadline.remainingKm.toLocaleString("it-IT")} km`}
                      {deadline.remainingKm !== null &&
                        deadline.daysRemaining !== null &&
                        " · "}
                      {deadline.daysRemaining !== null &&
                        `${deadline.daysRemaining}d`}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={urgencyBadgeVariant(deadline.urgency)}>
                        {deadline.urgency}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Maintenance History
        </h3>

        {records.length === 0 ? (
          <EmptyState
            icon={
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
            }
            title="No maintenance history"
            description="Completed workshop operations will appear here"
            action={
              <Link href={`/maintenance/${vehicleId}`}>
                <Button size="sm">Log First Record</Button>
              </Link>
            }
          />
        ) : (
          <MaintenanceTimeline records={records} />
        )}
      </section>
    </div>
  );
}
