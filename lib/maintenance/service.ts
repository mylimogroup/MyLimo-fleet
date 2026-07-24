import { maintenanceRecords } from "@/lib/maintenance/data";
import { computeMaintenanceAlerts } from "@/lib/maintenance/alerts";
import {
  formDataToRecord,
  recordToFormData,
  recordToListItem,
  type MaintenanceRepository,
} from "@/lib/maintenance/repository";
import type {
  MaintenanceAlert,
  MaintenanceFormData,
  MaintenanceKPIs,
  MaintenanceListItem,
  MaintenanceRecord,
} from "@/lib/types";
import { vehicles } from "@/lib/vehicles/data";
import { isCurrentMonth, daysUntil } from "@/lib/maintenance/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";

let recordStore = [...maintenanceRecords];

function computeKPIs(records: MaintenanceRecord[]): MaintenanceKPIs {
  const vehiclesInMaintenance = vehicles.filter(
    (v) => v.status === "maintenance"
  ).length;

  const upcomingServices = records.filter(
    (r) =>
      (r.status === "scheduled" || r.status === "in_progress") &&
      daysUntil(r.scheduledDate) >= 0 &&
      daysUntil(r.scheduledDate) <= 30
  ).length;

  const overdueMaintenance = records.filter(
    (r) => r.status === "overdue"
  ).length;

  const monthlyMaintenanceCosts = records
    .filter(
      (r) =>
        r.status === "completed" &&
        r.completedDate &&
        isCurrentMonth(r.completedDate)
    )
    .reduce((sum, r) => sum + r.totalCost, 0);

  return {
    vehiclesInMaintenance,
    upcomingServices,
    overdueMaintenance,
    monthlyMaintenanceCosts,
  };
}

export class MockMaintenanceRepository implements MaintenanceRepository {
  async list(): Promise<MaintenanceListItem[]> {
    return recordStore.map(recordToListItem);
  }

  async listByVehicle(vehicleId: string): Promise<MaintenanceRecord[]> {
    return recordStore
      .filter((r) => r.vehicleId === vehicleId)
      .sort(
        (a, b) =>
          new Date(b.scheduledDate).getTime() -
          new Date(a.scheduledDate).getTime()
      );
  }

  async getById(id: string): Promise<MaintenanceRecord | null> {
    return recordStore.find((r) => r.id === id) ?? null;
  }

  async create(data: MaintenanceFormData): Promise<MaintenanceRecord> {
    const record = formDataToRecord(data);
    recordStore = [record, ...recordStore];
    return record;
  }

  async update(
    id: string,
    data: Partial<MaintenanceFormData>
  ): Promise<MaintenanceRecord> {
    const index = recordStore.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Maintenance record ${id} not found`);

    const existing = recordStore[index];
    const merged = formDataToRecord(
      { ...recordToFormData(existing), ...data },
      id
    );
    merged.createdAt = existing.createdAt;
    merged.updatedAt = new Date().toISOString();
    recordStore[index] = merged;
    return merged;
  }

  async delete(id: string): Promise<void> {
    recordStore = recordStore.filter((r) => r.id !== id);
  }
}

export class SupabaseMaintenanceRepository implements MaintenanceRepository {
  async list(): Promise<MaintenanceListItem[]> {
    throw new Error("SupabaseMaintenanceRepository not yet implemented");
  }

  async listByVehicle(): Promise<MaintenanceRecord[]> {
    throw new Error("SupabaseMaintenanceRepository not yet implemented");
  }

  async getById(): Promise<MaintenanceRecord | null> {
    throw new Error("SupabaseMaintenanceRepository not yet implemented");
  }

  async create(): Promise<MaintenanceRecord> {
    throw new Error("SupabaseMaintenanceRepository not yet implemented");
  }

  async update(): Promise<MaintenanceRecord> {
    throw new Error("SupabaseMaintenanceRepository not yet implemented");
  }

  async delete(): Promise<void> {
    throw new Error("SupabaseMaintenanceRepository not yet implemented");
  }
}

export function getMaintenanceKPIs(): MaintenanceKPIs {
  return computeKPIs(recordStore);
}

export function getMaintenanceAlerts(): MaintenanceAlert[] {
  return computeMaintenanceAlerts(recordStore);
}

export function getMaintenanceRepository():
  | MockMaintenanceRepository
  | SupabaseMaintenanceRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseMaintenanceRepository();
  }
  return new MockMaintenanceRepository();
}
