"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { MaintenanceFormData, MaintenanceRecord, Vehicle } from "@/lib/types";
import { getMaintenanceRepository } from "@/lib/maintenance/service";
import { formatMileage } from "@/lib/maintenance/utils";
import { getAlertsForVehicle } from "@/lib/maintenance/alerts";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { computeAllDeadlines, urgencyBadgeVariant } from "@/lib/vehicles/deadlines";
import { formatDate } from "@/lib/vehicles/utils";
import { AlertBadges } from "@/components/ui/alert-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MaintenanceModal } from "@/components/maintenance/maintenance-modal";
import { MaintenanceTimeline } from "@/components/maintenance/maintenance-timeline";

interface VehicleMaintenanceDetailPageProps {
  vehicleId: string;
}

export function VehicleMaintenanceDetailPage({
  vehicleId,
}: VehicleMaintenanceDetailPageProps) {
  const repository = useMemo(() => getMaintenanceRepository(), []);
  const vehicleRepo = useMemo(() => getVehicleRepository(), []);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<
    MaintenanceFormData | undefined
  >();

  const loading = loadedId !== vehicleId;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      vehicleRepo.getById(vehicleId),
      repository.listByVehicle(vehicleId),
    ]).then(([vehicleData, recordData]) => {
      if (!cancelled) {
        setVehicle(vehicleData);
        setRecords(recordData);
        setLoadedId(vehicleId);
      }
    });
    return () => { cancelled = true; };
  }, [repository, vehicleRepo, vehicleId]);

  const alerts = useMemo(
    () => (vehicle ? getAlertsForVehicle(vehicle) : []),
    [vehicle]
  );

  const upcomingDeadlines = vehicle
    ? computeAllDeadlines(vehicle).filter((d) => !d.isAdministrative)
    : [];

  const refresh = async () => {
    const [vehicleData, recordData] = await Promise.all([
      vehicleRepo.getById(vehicleId),
      repository.listByVehicle(vehicleId),
    ]);
    setVehicle(vehicleData);
    setRecords(recordData);
  };

  const handleSave = async (data: MaintenanceFormData) => {
    if (editingId) {
      await repository.update(editingId, data);
    } else {
      await repository.create({ ...data, vehicleId });
    }
    await refresh();
  };

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-7xl py-16 text-center">
        <p className="text-lg font-medium">Vehicle not found</p>
        <Link href="/maintenance" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to Maintenance
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/maintenance"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Maintenance
      </Link>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">
              {vehicle.brand} {vehicle.model}
              {vehicle.version ? ` ${vehicle.version}` : ""}
            </h2>
            <Link
              href={`/vehicles/${vehicleId}`}
              className="text-sm text-primary hover:underline"
            >
              View vehicle
            </Link>
          </div>
          <p className="mt-1 font-mono text-sm text-muted">
            {vehicle.licensePlate}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {formatMileage(vehicle.currentMileage)}
          </p>
          {alerts.length > 0 && (
            <div className="mt-3">
              <AlertBadges alerts={alerts} />
            </div>
          )}
        </div>
        <Button onClick={() => { setEditingId(null); setEditFormData(undefined); setModalOpen(true); }}>
          Log Maintenance
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-border" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Upcoming Maintenance
            </h3>
            {upcomingDeadlines.length === 0 ? (
              <p className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted">
                No upcoming maintenance deadlines.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {upcomingDeadlines.map((deadline) => (
                      <tr key={deadline.id}>
                        <td className="px-4 py-3 font-medium">{deadline.label}</td>
                        <td className="px-4 py-3 text-xs tabular-nums">
                          {deadline.targetMileage !== null &&
                            formatMileage(deadline.targetMileage)}
                          {deadline.dueDate &&
                            ` · ${formatDate(deadline.dueDate)}`}
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
                description="Log the first completed workshop operation"
                action={
                  <Button size="sm" onClick={() => setModalOpen(true)}>
                    Log Maintenance
                  </Button>
                }
              />
            ) : (
              <MaintenanceTimeline records={records} />
            )}
          </section>
        </div>
      )}

      <MaintenanceModal
        key={editingId ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditFormData(undefined);
        }}
        onSave={handleSave}
        initialData={editFormData}
        defaultVehicleId={vehicleId}
        mode={editingId ? "edit" : "create"}
      />
    </div>
  );
}
