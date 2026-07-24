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
import { computeAllDeadlines } from "@/lib/vehicles/deadlines";
import { isCurrentMonth } from "@/lib/maintenance/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getVehicleStore, applyMaintenanceCompletion } from "@/lib/vehicles/service";

let recordStore = [...maintenanceRecords];

function computeKPIs(records: MaintenanceRecord[]): MaintenanceKPIs {
  const vehicles = getVehicleStore();
  const allDeadlines = vehicles.flatMap((v) => computeAllDeadlines(v));

  const vehicleIdsWithUrgent = new Set<string>();
  for (const vehicle of vehicles) {
    const deadlines = computeAllDeadlines(vehicle);
    if (deadlines.some((d) => d.urgency === "overdue" || d.urgency === "urgent")) {
      vehicleIdsWithUrgent.add(vehicle.id);
    }
  }

  const upcomingMaintenance = allDeadlines.filter(
    (d) =>
      !d.isAdministrative &&
      (d.urgency === "approaching" || d.urgency === "urgent")
  ).length;

  const overdueDeadlines = allDeadlines.filter(
    (d) => d.urgency === "overdue"
  ).length;

  const monthlyMaintenanceCosts = records
    .filter((r) => isCurrentMonth(r.completedDate))
    .reduce((sum, r) => sum + r.totalCost, 0);

  return {
    vehiclesRequiringAttention: vehicleIdsWithUrgent.size,
    upcomingMaintenance,
    overdueDeadlines,
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
          new Date(b.completedDate).getTime() -
          new Date(a.completedDate).getTime()
      );
  }

  async getById(id: string): Promise<MaintenanceRecord | null> {
    return recordStore.find((r) => r.id === id) ?? null;
  }

  async create(data: MaintenanceFormData): Promise<MaintenanceRecord> {
    const record = formDataToRecord(data);
    const deadlineIds = applyMaintenanceCompletion(record, data);
    record.generatedDeadlineIds = deadlineIds;
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
    merged.generatedDeadlineIds = existing.generatedDeadlineIds;
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
  return computeMaintenanceAlerts(getVehicleStore());
}

export function getMaintenanceRepository():
  | MockMaintenanceRepository
  | SupabaseMaintenanceRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseMaintenanceRepository();
  }
  return new MockMaintenanceRepository();
}
