"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Vehicle, VehicleDocument, VehicleFormData } from "@/lib/types";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { vehicleToFormData } from "@/lib/vehicles/repository";
import { formatDate, formatMileage } from "@/lib/vehicles/utils";
import { AlertBadges } from "@/components/ui/alert-badges";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { getAlertsForVehicle } from "@/lib/maintenance/alerts";
import { OverviewTab } from "@/components/vehicles/detail/overview-tab";
import { DocumentsTab } from "@/components/vehicles/detail/documents-tab";
import { MaintenanceTab } from "@/components/vehicles/detail/maintenance-tab";
import { DeadlinesTab } from "@/components/vehicles/detail/deadlines-tab";
import { CostsTab } from "@/components/vehicles/detail/costs-tab";
import { HistoryTab } from "@/components/vehicles/detail/history-tab";
import { MileageUpdateModal } from "@/components/vehicles/mileage-update-modal";
import { VehicleModal } from "@/components/vehicles/vehicle-modal";

const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "maintenance", label: "Maintenance" },
  { id: "deadlines", label: "Deadlines" },
  { id: "costs", label: "Costs" },
  { id: "history", label: "History" },
];

interface VehicleDetailPageProps {
  vehicleId: string;
}

export function VehicleDetailPage({ vehicleId }: VehicleDetailPageProps) {
  const router = useRouter();
  const repository = useMemo(() => getVehicleRepository(), []);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mileageOpen, setMileageOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [maintenanceRefreshKey, setMaintenanceRefreshKey] = useState(0);

  const loading = loadedId !== vehicleId;

  const refresh = async () => {
    const data = await repository.getById(vehicleId);
    setVehicle(data);
    setMaintenanceRefreshKey((key) => key + 1);
  };

  useEffect(() => {
    let cancelled = false;
    repository.getById(vehicleId).then((data) => {
      if (!cancelled) {
        setVehicle(data);
        setLoadedId(vehicleId);
      }
    });
    return () => { cancelled = true; };
  }, [repository, vehicleId]);

  const alerts = useMemo(
    () => (vehicle ? getAlertsForVehicle(vehicle) : []),
    [vehicle]
  );

  const handleMileageUpdate = async (mileage: number) => {
    await repository.updateMileage(vehicleId, mileage);
    await refresh();
  };

  const handleEditSave = async (data: VehicleFormData) => {
    await repository.update(vehicleId, data);
    await refresh();
  };

  const handleDocumentsUpdate = async (documents: VehicleDocument[]) => {
    await repository.updateDocuments(vehicleId, documents);
    await refresh();
  };

  const handleDelete = async () => {
    await repository.delete(vehicleId);
    router.push("/vehicles");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-border" />
        <div className="h-28 rounded-xl bg-border" />
        <div className="h-64 rounded-xl bg-border" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-7xl py-16 text-center">
        <p className="text-lg font-medium">Vehicle not found</p>
        <Link href="/vehicles" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to Vehicles
        </Link>
      </div>
    );
  }

  const title = [vehicle.brand, vehicle.model, vehicle.version]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link
        href="/vehicles"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Vehicles
      </Link>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="mt-1 font-mono text-sm text-muted">
              {vehicle.licensePlate}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <dt className="text-xs text-muted">Mileage</dt>
                <dd className="font-semibold tabular-nums">
                  {formatMileage(vehicle.currentMileage)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">First Registration</dt>
                <dd className="font-medium">
                  {vehicle.firstRegistrationDate
                    ? formatDate(vehicle.firstRegistrationDate)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Year</dt>
                <dd className="font-medium">{vehicle.year}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-muted">VIN</dt>
                <dd className="font-mono text-xs font-medium">{vehicle.vin}</dd>
              </div>
            </dl>
            {alerts.length > 0 && (
              <div className="mt-4">
                <AlertBadges alerts={alerts} />
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setMileageOpen(true)}>
              Update Mileage
            </Button>
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              Edit Vehicle
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-5 pt-4">
          <Tabs tabs={DETAIL_TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-5">
          {activeTab === "overview" && <OverviewTab vehicle={vehicle} />}
          {activeTab === "documents" && (
            <DocumentsTab
              vehicle={vehicle}
              onUpdateDocuments={handleDocumentsUpdate}
            />
          )}
          {activeTab === "maintenance" && (
            <MaintenanceTab
              vehicleId={vehicleId}
              vehicle={vehicle}
              refreshKey={maintenanceRefreshKey}
            />
          )}
          {activeTab === "deadlines" && (
            <DeadlinesTab vehicle={vehicle} onRefresh={refresh} />
          )}
          {activeTab === "costs" && <CostsTab vehicle={vehicle} />}
          {activeTab === "history" && <HistoryTab vehicle={vehicle} />}
        </div>
      </div>

      <MileageUpdateModal
        open={mileageOpen}
        onClose={() => setMileageOpen(false)}
        currentMileage={vehicle.currentMileage}
        onSave={handleMileageUpdate}
      />

      <VehicleModal
        key={vehicle.id}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
        initialData={vehicleToFormData(vehicle)}
        mode="edit"
      />
    </div>
  );
}
