import { vehicles } from "@/lib/vehicles/data";
import {
  applyMileageUpdate,
  formDataToVehicle,
  vehicleToFormData,
  vehicleToListItem,
  type VehicleRepository,
} from "@/lib/vehicles/repository";
import { getDocumentCategoryLabel } from "@/lib/vehicles/documents";
import {
  buildDeadlinesFromMaintenance,
  maintenanceCategoryToDeadlineCategory,
  maintenanceHistoryType,
  mergeVehicleDeadlines,
} from "@/lib/vehicles/deadlines";
import { getCategoryLabel } from "@/lib/maintenance/utils";
import type {
  MaintenanceFormData,
  MaintenanceRecord,
  Vehicle,
  VehicleFilters,
  VehicleFormData,
  VehicleListItem,
} from "@/lib/types";

let vehicleStore = [...vehicles];

export function getVehicleStore(): Vehicle[] {
  return vehicleStore;
}

export function applyMaintenanceCompletion(
  record: MaintenanceRecord,
  formData: MaintenanceFormData
): string[] {
  const index = vehicleStore.findIndex((v) => v.id === record.vehicleId);
  if (index === -1) return [];

  const vehicle = vehicleStore[index];
  const newDeadlines = buildDeadlinesFromMaintenance(formData, record.id);
  const completedCategory = maintenanceCategoryToDeadlineCategory(
    record.category
  );
  const updatedDeadlines = mergeVehicleDeadlines(
    vehicle.deadlines,
    newDeadlines,
    completedCategory
  );

  const now = new Date().toISOString();
  vehicleStore[index] = {
    ...vehicle,
    deadlines: updatedDeadlines,
    updatedAt: now,
    history: [
      {
        id: crypto.randomUUID(),
        type: maintenanceHistoryType(record.category),
        description: `${getCategoryLabel(record.category)} completed at ${record.mileage.toLocaleString("it-IT")} km — ${record.workshop}`,
        timestamp: now,
      },
      ...vehicle.history,
    ],
  };

  return newDeadlines.map((d) => d.id);
}

function applyFilters(
  items: VehicleListItem[],
  filters?: VehicleFilters
): VehicleListItem[] {
  if (!filters) return items;

  return items.filter((item) => {
    if (filters.brand && item.brand !== filters.brand) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack =
        `${item.licensePlate} ${item.brand} ${item.model} ${item.version}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export class MockVehicleRepository implements VehicleRepository {
  async list(filters?: VehicleFilters): Promise<VehicleListItem[]> {
    const items = vehicleStore.map(vehicleToListItem);
    return applyFilters(items, filters);
  }

  async getById(id: string): Promise<Vehicle | null> {
    return vehicleStore.find((v) => v.id === id) ?? null;
  }

  async create(data: VehicleFormData): Promise<Vehicle> {
    const vehicle = formDataToVehicle(data);
    vehicleStore = [vehicle, ...vehicleStore];
    return vehicle;
  }

  async update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle> {
    const index = vehicleStore.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    const existing = vehicleStore[index];
    const merged = formDataToVehicle(
      { ...vehicleToFormData(existing), ...data },
      id,
      existing
    );
    merged.createdAt = existing.createdAt;
    merged.documents = existing.documents;
    merged.costs = existing.costs;
    merged.deadlines = existing.deadlines;
    merged.history = merged.history;
    merged.lastMileageUpdateDate = existing.lastMileageUpdateDate;

    vehicleStore[index] = merged;
    return merged;
  }

  async updateMileage(id: string, mileage: number): Promise<Vehicle> {
    const index = vehicleStore.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    const updated = applyMileageUpdate(vehicleStore[index], mileage);
    vehicleStore[index] = updated;
    return updated;
  }

  async updateDocuments(
    id: string,
    documents: Vehicle["documents"]
  ): Promise<Vehicle> {
    const index = vehicleStore.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    const existing = vehicleStore[index];
    const now = new Date().toISOString();
    const historyEntries: Vehicle["history"] = [];

    for (const doc of documents) {
      const prev = existing.documents.find((d) => d.id === doc.id);
      if (!prev) {
        historyEntries.push({
          id: crypto.randomUUID(),
          type: "document_added",
          description: `Document added: ${getDocumentCategoryLabel(doc.category)}`,
          timestamp: now,
        });
      } else if (
        prev.category !== doc.category ||
        prev.issueDate !== doc.issueDate ||
        prev.expirationDate !== doc.expirationDate ||
        prev.pdfUrl !== doc.pdfUrl
      ) {
        historyEntries.push({
          id: crypto.randomUUID(),
          type: "document_updated",
          description: `Document updated: ${getDocumentCategoryLabel(doc.category)}`,
          timestamp: now,
        });
      }
    }

    for (const doc of existing.documents) {
      if (!documents.some((d) => d.id === doc.id)) {
        historyEntries.push({
          id: crypto.randomUUID(),
          type: "document_deleted",
          description: `Document removed: ${getDocumentCategoryLabel(doc.category)}`,
          timestamp: now,
        });
      }
    }

    vehicleStore[index] = {
      ...existing,
      documents,
      updatedAt: now,
      history: [...historyEntries, ...existing.history],
    };
    return vehicleStore[index];
  }

  async updateCosts(id: string, costs: Vehicle["costs"]): Promise<Vehicle> {
    const index = vehicleStore.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    const now = new Date().toISOString();
    vehicleStore[index] = {
      ...vehicleStore[index],
      costs,
      updatedAt: now,
    };
    return vehicleStore[index];
  }

  async delete(id: string): Promise<void> {
    vehicleStore = vehicleStore.filter((v) => v.id !== id);
  }
}

export class SupabaseVehicleRepository implements VehicleRepository {
  async list(): Promise<VehicleListItem[]> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }

  async getById(): Promise<Vehicle | null> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }

  async create(): Promise<Vehicle> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }

  async update(): Promise<Vehicle> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }

  async updateMileage(): Promise<Vehicle> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }

  async updateDocuments(): Promise<Vehicle> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }

  async updateCosts(): Promise<Vehicle> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }

  async delete(): Promise<void> {
    throw new Error("SupabaseVehicleRepository not yet implemented");
  }
}

import { isSupabaseConfigured } from "@/lib/supabase/client";

export function getVehicleRepository(): VehicleRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseVehicleRepository();
  }
  return new MockVehicleRepository();
}
