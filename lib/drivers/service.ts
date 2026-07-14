import { drivers } from "@/lib/drivers/data";
import {
  driverToFormData,
  driverToListItem,
  formDataToDriver,
  type DriverRepository,
} from "@/lib/drivers/repository";
import type { Driver, DriverFormData, DriverListItem } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";

let driverStore = [...drivers];

export class MockDriverRepository implements DriverRepository {
  async list(): Promise<DriverListItem[]> {
    return driverStore.map(driverToListItem);
  }

  async getById(id: string): Promise<Driver | null> {
    return driverStore.find((d) => d.id === id) ?? null;
  }

  async create(data: DriverFormData): Promise<Driver> {
    const driver = formDataToDriver(data);
    driverStore = [driver, ...driverStore];
    return driver;
  }

  async update(id: string, data: Partial<DriverFormData>): Promise<Driver> {
    const index = driverStore.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`Driver ${id} not found`);

    const existing = driverStore[index];
    const merged = formDataToDriver(
      {
        ...driverToFormData(existing),
        ...data,
        personal: { ...existing.personal, ...data.personal },
        documents: { ...existing.documents, ...data.documents },
        operational: { ...existing.operational, ...data.operational },
      },
      id
    );
    merged.createdAt = existing.createdAt;
    merged.assignments = existing.assignments;
    merged.leaves = existing.leaves;
    merged.updatedAt = new Date().toISOString();

    driverStore[index] = merged;
    return merged;
  }

  async delete(id: string): Promise<void> {
    driverStore = driverStore.filter((d) => d.id !== id);
  }
}

export class SupabaseDriverRepository implements DriverRepository {
  async list(): Promise<DriverListItem[]> {
    throw new Error("SupabaseDriverRepository not yet implemented");
  }

  async getById(): Promise<Driver | null> {
    throw new Error("SupabaseDriverRepository not yet implemented");
  }

  async create(): Promise<Driver> {
    throw new Error("SupabaseDriverRepository not yet implemented");
  }

  async update(): Promise<Driver> {
    throw new Error("SupabaseDriverRepository not yet implemented");
  }

  async delete(): Promise<void> {
    throw new Error("SupabaseDriverRepository not yet implemented");
  }
}

export function getDriverRepository(): DriverRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseDriverRepository();
  }
  return new MockDriverRepository();
}
