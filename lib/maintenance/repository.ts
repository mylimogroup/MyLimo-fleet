import { vehicles } from "@/lib/vehicles/data";
import type {
  MaintenanceFormData,
  MaintenanceListItem,
  MaintenanceRecord,
} from "@/lib/types";

export interface MaintenanceRepository {
  list(): Promise<MaintenanceListItem[]>;
  listByVehicle(vehicleId: string): Promise<MaintenanceRecord[]>;
  getById(id: string): Promise<MaintenanceRecord | null>;
  create(data: MaintenanceFormData): Promise<MaintenanceRecord>;
  update(id: string, data: Partial<MaintenanceFormData>): Promise<MaintenanceRecord>;
  delete(id: string): Promise<void>;
}

export function resolveVehicle(vehicleId: string) {
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return null;
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    licensePlate: vehicle.licensePlate,
    currentMileage: vehicle.currentMileage,
  };
}

export function recordToListItem(record: MaintenanceRecord): MaintenanceListItem {
  const vehicle = resolveVehicle(record.vehicleId);
  return {
    id: record.id,
    vehicleId: record.vehicleId,
    vehicleBrand: vehicle?.brand ?? "Unknown",
    vehicleModel: vehicle?.model ?? "",
    licensePlate: vehicle?.licensePlate ?? "—",
    category: record.category,
    workshop: record.workshop,
    completedDate: record.completedDate,
    mileage: record.mileage,
    labourCost: record.labourCost,
    totalCost: record.totalCost,
  };
}

export function formDataToRecord(
  data: MaintenanceFormData,
  id?: string
): MaintenanceRecord {
  const now = new Date().toISOString();
  const labour = typeof data.labourCost === "number" ? data.labourCost : 0;
  const total =
    typeof data.totalCost === "number" ? data.totalCost : labour;

  return {
    id: id ?? crypto.randomUUID(),
    vehicleId: data.vehicleId,
    category: data.category,
    description: data.description,
    workshop: data.workshop,
    completedDate: data.completedDate,
    mileage: typeof data.mileage === "number" ? data.mileage : 0,
    labourCost: labour,
    totalCost: total,
    notes: data.notes,
    invoicePdfUrl: data.invoicePdfUrl,
    invoicePdfName: data.invoicePdfName,
    tireDetails: data.tireDetails,
    recurrence: data.recurrence.enabled ? data.recurrence : null,
    generatedDeadlineIds: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function recordToFormData(record: MaintenanceRecord): MaintenanceFormData {
  return {
    vehicleId: record.vehicleId,
    category: record.category,
    description: record.description,
    workshop: record.workshop,
    completedDate: record.completedDate,
    mileage: record.mileage,
    labourCost: record.labourCost,
    totalCost: record.totalCost,
    notes: record.notes,
    invoicePdfUrl: record.invoicePdfUrl,
    invoicePdfName: record.invoicePdfName,
    tireDetails: record.tireDetails,
    recurrence: record.recurrence ?? {
      enabled: false,
      repeatEveryKm: null,
      repeatEveryMonths: null,
    },
    tireRotationReminder: {
      enabled: false,
      intervalKm: 10000,
    },
  };
}

export function createEmptyMaintenanceForm(): MaintenanceFormData {
  return {
    vehicleId: "",
    category: "oil_change",
    description: "",
    workshop: "",
    completedDate: new Date().toISOString().split("T")[0],
    mileage: "",
    labourCost: "",
    totalCost: "",
    notes: "",
    invoicePdfUrl: null,
    invoicePdfName: null,
    tireDetails: null,
    recurrence: {
      enabled: false,
      repeatEveryKm: null,
      repeatEveryMonths: null,
    },
    tireRotationReminder: {
      enabled: false,
      intervalKm: 10000,
    },
  };
}
