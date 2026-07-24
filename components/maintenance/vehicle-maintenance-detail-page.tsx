"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { MaintenanceFormData, MaintenanceRecord } from "@/lib/types";
import { getMaintenanceRepository } from "@/lib/maintenance/service";
import { getAlertsForVehicle } from "@/lib/maintenance/alerts";
import { formatMileage } from "@/lib/maintenance/utils";
import { vehicles } from "@/lib/vehicles/data";
import { AlertBadges } from "@/components/ui/alert-badges";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MaintenanceModal } from "@/components/maintenance/maintenance-modal";
import { MaintenanceTimeline } from "@/components/maintenance/maintenance-timeline";
import { VehicleStatusBadge } from "@/components/vehicles/vehicle-status-badge";

interface VehicleMaintenanceDetailPageProps {
  vehicleId: string;
}

export function VehicleMaintenanceDetailPage({
  vehicleId,
}: VehicleMaintenanceDetailPageProps) {
  const repository = useMemo(() => getMaintenanceRepository(), []);
  const vehicle = vehicles.find((v) => v.id === vehicleId);

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
    repository.listByVehicle(vehicleId).then((data) => {
      if (!cancelled) {
        setRecords(data);
        setLoadedId(vehicleId);
      }
    });
    return () => { cancelled = true; };
  }, [repository, vehicleId]);

  const alerts = useMemo(
    () => getAlertsForVehicle(vehicleId, records),
    [vehicleId, records]
  );

  const refresh = async () => {
    const data = await repository.listByVehicle(vehicleId);
    setRecords(data);
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
            </h2>
            <VehicleStatusBadge status={vehicle.status} />
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
          Add Record
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-border" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          icon={
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
          }
          title="No maintenance history"
          description="Add the first service record for this vehicle"
          action={
            <Button size="sm" onClick={() => setModalOpen(true)}>
              Add Record
            </Button>
          }
        />
      ) : (
        <MaintenanceTimeline records={records} />
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
