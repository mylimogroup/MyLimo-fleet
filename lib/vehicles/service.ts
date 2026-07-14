import { vehicles } from "@/lib/vehicles/data";
import {
  formDataToVehicle,
  vehicleToListItem,
  type VehicleRepository,
} from "@/lib/vehicles/repository";
import type {
  Vehicle,
  VehicleFilters,
  VehicleFormData,
  VehicleListItem,
} from "@/lib/types";

let vehicleStore = [...vehicles];

function applyFilters(
  items: VehicleListItem[],
  filters?: VehicleFilters
): VehicleListItem[] {
  if (!filters) return items;

  return items.filter((item) => {
    if (filters.status && filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    if (filters.brand && item.brand !== filters.brand) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${item.licensePlate} ${item.brand} ${item.model}`.toLowerCase();
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
      {
        photoUrl: data.photoUrl ?? existing.photoUrl,
        licensePlate: data.licensePlate ?? existing.licensePlate,
        brand: data.brand ?? existing.brand,
        model: data.model ?? existing.model,
        year: data.year ?? existing.year,
        vin: data.vin ?? existing.vin,
        color: data.color ?? existing.color,
        fuel: data.fuel ?? existing.fuel,
        transmission: data.transmission ?? existing.transmission,
        seats: data.seats ?? existing.seats,
        currentMileage: data.currentMileage ?? existing.currentMileage,
        status: data.status ?? existing.status,
        deadlines: data.deadlines ?? existing.deadlines,
        maintenance: data.maintenance ?? existing.maintenance,
        tires: data.tires ?? existing.tires,
        documents: data.documents ?? existing.documents,
        costs: data.costs ?? existing.costs,
        notes: data.notes ?? existing.notes,
      },
      id
    );
    merged.createdAt = existing.createdAt;
    merged.updatedAt = new Date().toISOString();

    vehicleStore[index] = merged;
    return merged;
  }

  async delete(id: string): Promise<void> {
    vehicleStore = vehicleStore.filter((v) => v.id !== id);
  }
}

/**
 * Supabase-backed repository. Activate by installing @supabase/supabase-js
 * and setting environment variables.
 */
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
