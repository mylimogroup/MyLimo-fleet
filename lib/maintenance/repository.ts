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
    status: record.status,
    workshop: record.workshop,
    scheduledDate: record.scheduledDate,
    completedDate: record.completedDate,
    mileage: record.mileage,
    estimatedCost: record.estimatedCost,
    totalCost: record.totalCost,
    nextServiceDate: record.nextServiceDate,
  };
}

export function formDataToRecord(
  data: MaintenanceFormData,
  id?: string
): MaintenanceRecord {
  const now = new Date().toISOString();
  const labour = typeof data.labourCost === "number" ? data.labourCost : 0;
  const parts = typeof data.partsCost === "number" ? data.partsCost : 0;
  const estimated =
    typeof data.estimatedCost === "number" ? data.estimatedCost : labour + parts;

  return {
    id: id ?? crypto.randomUUID(),
    vehicleId: data.vehicleId,
    category: data.category,
    status: data.status,
    description: data.description,
    workshop: data.workshop,
    invoiceNumber: data.invoiceNumber || null,
    scheduledDate: data.scheduledDate,
    completedDate: data.completedDate,
    mileage: typeof data.mileage === "number" ? data.mileage : 0,
    labourCost: labour,
    partsCost: parts,
    totalCost: data.status === "completed" ? labour + parts : 0,
    estimatedCost: estimated,
    nextServiceDate: data.nextServiceDate,
    nextServiceMileage: data.nextServiceMileage,
    notes: data.notes,
    attachments: data.attachments,
    createdAt: now,
    updatedAt: now,
  };
}

export function recordToFormData(record: MaintenanceRecord): MaintenanceFormData {
  return {
    vehicleId: record.vehicleId,
    category: record.category,
    status: record.status,
    description: record.description,
    workshop: record.workshop,
    invoiceNumber: record.invoiceNumber ?? "",
    scheduledDate: record.scheduledDate,
    completedDate: record.completedDate,
    mileage: record.mileage,
    labourCost: record.labourCost,
    partsCost: record.partsCost,
    estimatedCost: record.estimatedCost,
    nextServiceDate: record.nextServiceDate,
    nextServiceMileage: record.nextServiceMileage,
    notes: record.notes,
    attachments: record.attachments,
  };
}

export function createEmptyMaintenanceForm(): MaintenanceFormData {
  return {
    vehicleId: "",
    category: "oil_change",
    status: "scheduled",
    description: "",
    workshop: "",
    invoiceNumber: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    completedDate: null,
    mileage: "",
    labourCost: "",
    partsCost: "",
    estimatedCost: "",
    nextServiceDate: null,
    nextServiceMileage: null,
    notes: "",
    attachments: [],
  };
}
